import { Request, Response, Router } from "express";
import passport from "passport";
const passportSetup = require("./passportControllers");

const router: Router = Router();

router.get("/logout", function (req, res) {
    req.logout();
    res.redirect("http://localhost:3000");
});

router.get("/google", (req, res, next) => {
    passport.authenticate("google", { scope: ["profile"] })(req, res, next);
});

router.get(
    "/google/callback",
    passport.authenticate("google", {
        failureRedirect: "http://localhost:3000/login",
        successRedirect: "http://localhost:3000/login",
        session: true,
    })
);

router.get("/twitter", (req, res, next) => {
    passport.authenticate("twitter")(req, res, next);
});

router.get(
    "/twitter/callback",
    passport.authenticate("twitter", {
        failureRedirect: "http://localhost:3000/login",
        successRedirect: "http://localhost:3000/login",
        session: true,
    })
);

router.get("/github", (req, res, next) => {
    passport.authenticate("github")(req, res, next);
});

router.get(
    "/github/callback",
    passport.authenticate("github", {
        failureRedirect: "http://localhost:3000/login",
        successRedirect: "http://localhost:3000/login",
        session: true,
    })
);

router.get("/me", (req, res) => {
    console.log("Tried to get the current user");
    console.log(req.user);
    res.send(req.user);
});

export default router;
