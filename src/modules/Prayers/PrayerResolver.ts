import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  PubSub,
  Authorized,
  FieldResolver,
  Root,
} from "type-graphql";
import { FindManyOptions, In, LessThan } from "typeorm";
import { Prayer } from "../../entity/Prayer";
import { User, UserRole } from "../../entity/User";
import { AppContext } from "../../utlis/context";
import { PrayerInput } from "./inputs/PrayerInput";

import { EditPrayerInput } from "./inputs/EditPrayerInput";
import { PrayerComments } from "../../entity/PrayerComments";
import { PrayerCommentInput } from "./inputs/PrayerCommentInput";
import { PubSubEngine } from "graphql-subscriptions";
import { PrayerPrayedBy } from "../../entity/PrayerPrayedBy";
import { Following } from "../../entity/Following";
import { List } from "../../entity/List";

// Resolver for the Prayer entity
@Resolver(Prayer)
export class PrayerResolver {
  // Field resolver to tell us how many times the
  // current user has prayed this prayer
  @FieldResolver({ nullable: true })
  async prayedByUser(
    @Root() prayer: Prayer,
    @Ctx() { req }: AppContext
  ): Promise<number | null> {
    if (!req.user) return null;
    const prayedBy = await PrayerPrayedBy.find({
      where: { prayer: prayer.id, user: req.user.id },
    });
    return prayedBy.length;
  }

  // Get all the public prayers
  // Auth: all users
  @Query((): typeof Prayer[] => [Prayer], { nullable: true })
  async publicPrayers(
    @Arg("cursor", { nullable: true }) cursor: string,
    @Ctx() { req }: AppContext
  ): Promise<Prayer[] | null> {
    try {
      const options: FindManyOptions<Prayer> = {
        take: 6,
        order: { createdDate: "DESC" },
        where: { privat: false },
        relations: ["user", "comments", "prayedBy", "prayedBy.user"],
      };

      if (cursor) {
        options.where = {
          createdDate: LessThan(cursor),
          privat: false,
        };
      }

      const p: Prayer[] = await Prayer.find(options);

      if (p) {
        if (!req.user) {
          const returnVal: Prayer[] = p.map(
            (prayer: Prayer): Prayer =>
              Object.assign(prayer, { prayedByUser: 0 })
          );
          return returnVal;
        } else {
          const status = p.map(
            (p: Prayer): Prayer =>
              Object.assign(p, {
                prayedByUser: p.prayedBy
                  .map((prayed) => prayed.user.id)
                  .filter((id: number) => id === req.user.id).length,
              })
          );
          return status;
        }
      } else return null;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  // Get all the prayers of the current logged in user
  // Auth: any logged in user
  @Authorized([UserRole.admin, UserRole.loggedIn])
  @Query((): typeof Prayer[] => [Prayer], { nullable: true })
  async myPrayers(@Ctx() { req }: AppContext): Promise<Prayer[] | null> {
    try {
      if (!req.user) {
        return null;
      }

      const p: Prayer[] = await Prayer.find({
        where: { user: { id: req.user.id } },
        relations: ["prayedBy", "user", "comments"],
      });

      if (p) {
        return p;
      } else return null;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  // Get one prayer (for editing or comments)
  // Auth: any user => prayer must be public or user the owner of the prayer
  @Query(() => Prayer, { nullable: true })
  async onePrayer(
    @Ctx() { req }: AppContext,
    @Arg("id") id: number
  ): Promise<Prayer | null> {
    try {
      const p: Prayer = await Prayer.findOne(id, {
        relations: ["user", "comments", "comments.user", "lists"],
      });
      if (p && (p.privat === false || p.user.id === req.user.id)) {
        return p;
      } else return null;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  // Get the prayers of people that are being followed by the current user
  // Auth: logged in user
  @Authorized([UserRole.loggedIn, UserRole.admin])
  @Query(() => [Prayer])
  async getFollowingPrayers(
    @Ctx() { req }: AppContext
  ): Promise<Prayer[] | null> {
    try {
      if (!req.user) {
        return null;
      }

      const me = await User.findOne(req.user.id, {
        relations: ["createdFollows", "createdFollows.followingId"],
      });
      const ids: number[] = me.createdFollows.map(
        (f: Following) => f.followingId.id
      );
      const prayers = await Prayer.find({
        where: {
          user: { id: In(ids) },
          privat: false,
        },
        relations: ["user", "comments", "prayedBy", "prayedBy.user"],
      });
      return prayers;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  // Get prayers that are featured by the site
  // Auth: all users
  @Query(() => [Prayer])
  async featuredPrayers(): Promise<Prayer[] | null> {
    try {
      const prayers = await Prayer.find({
        where: {
          featured: true,
          privat: false,
        },
        relations: ["user", "comments", "prayedBy", "prayedBy.user"],
        take: 3,
      });
      return prayers;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  // Add a prayer
  // Auth: must be logged in as some kind of user
  @Authorized([UserRole.admin, UserRole.loggedIn])
  @Mutation(() => Prayer)
  async addPrayer(
    @Arg("PrayerInput")
    { title, body, category, answered, privat, lists, photo }: PrayerInput,
    @Ctx() { req }: AppContext,
    @PubSub() pubSub: PubSubEngine
  ): Promise<Prayer | null> {
    try {
      if (!req.user) {
        return null;
      }

      const l = (await List.findByIds(lists, { relations: ["owner"] })).filter(
        (ls) => ls.owner.id === req.user.id
      );

      const p = await Prayer.create({
        title,
        body,
        privat,
        answered,
        category,
        user: req.user,
        lists: l,
        photo: JSON.parse(photo),
      }).save();

      if (!privat) {
        const event = `${req.user.username} created the prayer \"${title}\"`;
        pubSub.publish("EVENTS", {
          event,
        });
      }

      return p;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  // Edit a prayer
  // Auth: Must be the owner of the prayer
  @Authorized([UserRole.admin, UserRole.loggedIn])
  @Mutation(() => Prayer, { nullable: true })
  async editPrayer(
    @Arg("EditPrayerInput")
    {
      id,
      title,
      body,
      category,
      answered,
      privat,
      lists,
      photo,
    }: EditPrayerInput,
    @Ctx() { req }: AppContext
  ): Promise<Prayer | null> {
    try {
      if (!req.user) {
        return null;
      }

      const l = (await List.findByIds(lists, { relations: ["owner"] })).filter(
        (ls) => ls.owner.id === req.user.id
      );

      const p: Prayer = await Prayer.findOne(id, {
        relations: ["user", "comments"],
      });
      if (p.user.id !== req.user.id) {
        return null;
      } else {
        const u = Object.assign(p, {
          title,
          body,
          category,
          answered,
          privat,
          lists: l,
          photo,
        });

        const d: Prayer = await u.save();

        return d;
      }
    } catch {
      return null;
    }
  }

  // Update a prayer to answered
  // Auth: Must be the owner of the prayer
  @Authorized([UserRole.admin, UserRole.loggedIn])
  @Mutation(() => Boolean)
  async markAsAnswered(
    @Arg("id") id: number,
    @Ctx() { req }: AppContext,
    @PubSub() pubSub: PubSubEngine
  ): Promise<boolean> {
    try {
      if (!req.user) {
        return false;
      }

      const p: Prayer = await Prayer.findOne(id, { relations: ["user"] });
      if (p.user.id !== req.user.id) {
        return false;
      }

      p.answered = true;
      await p.save();

      if (!p.privat) {
        const event = `${req.user.username} updated the prayer \"${p.title}\" to answered!`;
        pubSub.publish("EVENTS", {
          event,
        });
      }

      return true;
    } catch {
      return false;
    }
  }

  // Delete a prayer
  // Auth: Must be the owner of the prayer or admin
  @Authorized([UserRole.admin, UserRole.loggedIn])
  @Mutation(() => Boolean)
  async deletePrayer(
    @Arg("id")
    id: number,
    @Ctx() { req }: AppContext
  ): Promise<Boolean> {
    try {
      if (!req.user) {
        return false;
      }

      const p: Prayer = await Prayer.findOne(id, { relations: ["user"] });
      if (req.user.role === UserRole.admin || p.user.id === req.user.id) {
        await Prayer.delete(id);
        return true;
      }
      return false;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  // Add a comment to a prayer
  // Auth: Must be logged in as some kind of user
  @Authorized([UserRole.admin, UserRole.loggedIn])
  @Mutation(() => PrayerComments)
  async addComment(
    @Ctx() { req }: AppContext,
    @Arg("PrayerCommentInput")
    { body, prayerId, privat }: PrayerCommentInput
  ): Promise<PrayerComments | null> {
    try {
      if (!req.user) {
        return null;
      }

      const prayer = await Prayer.findOne(prayerId);
      const user = await User.findOne(req.user);

      return await PrayerComments.create({
        body,
        privat,
        prayer,
        user,
      }).save();
    } catch {
      return null;
    }
  }

  // Delete a comment
  // Auth: Must be the owner of the comment or admin
  @Mutation(() => Boolean)
  async deleteComment(
    @Ctx() { req }: AppContext,
    @Arg("id") id: number
  ): Promise<boolean> {
    try {
      if (!req.user) {
        return false;
      }

      const comment: PrayerComments = await PrayerComments.findOne(id, {
        relations: ["user"],
      });

      if (comment.user.id === req.user.id || req.user.role === UserRole.admin) {
        await PrayerComments.delete(id);
        return true;
      } else {
        return false;
      }
    } catch {
      return false;
    }
  }

  // Add a prayed reciept to a prayer
  // Auth: Must be logged in as some kind of user
  @Authorized([UserRole.admin, UserRole.loggedIn])
  @Mutation(() => Boolean)
  async prayed(
    @Ctx() { req }: AppContext,
    @Arg("id") id: number
  ): Promise<boolean> {
    try {
      if (!req.user) {
        return false;
      }

      const prayer: Prayer = await Prayer.findOne(id);
      const user: User = await User.findOne(req.user.id);

      await PrayerPrayedBy.create({
        prayer,
        user,
      }).save();

      return true;
    } catch (err) {
      return false;
    }
  }
}
