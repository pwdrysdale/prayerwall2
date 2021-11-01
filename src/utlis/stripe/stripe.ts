import { eachDayOfIntervalWithOptions } from "date-fns/fp";
import Router, { request, Request } from "express";
import { v4 as uuid } from "uuid";
import dotenv from "dotenv";
import { userInfo } from "os";

const stripe = require("stripe")(process.env.TEST_STRIPE_SECRET_KEY);

const router = Router();

dotenv.config();

router.get("/", (req, res) => {
    console.log("In a stripe route");
    console.log("Key: ", process.env.TEST_STRIPE_PUBLISHABLE_KEY);
    res.status(200).json({
        key: process.env.TEST_STRIPE_PUBLISHABLE_KEY,
    });
});

interface ReqExtend extends Request {
    user?: {
        id?: number;
    };
}

router.post("/pay", (req: ReqExtend, res) => {
    console.log("Got to the server");
    console.log(req.body);
    const { amount, token } = req.body;
    const { email } = token;
    const user = req.user && req.user.id ? req.user.id : uuid();
    // const user =  req.user?.id? || uuid();
    console.log("User: ", user);
    const itemPotencyKey = user;

    return stripe.customers
        .create({
            email,
            // we want source to be a customer id
            source: uuid(),
        })
        .then(
            (customer) => {
                stripe.charges
                    .create({
                        amount,
                        currency: "usd",
                        customer: customer.id,
                        receipt_email: email,
                        description: "The Prayer Wall - Giving",
                    })
                    .then((charge) => {
                        console.log(charge);
                        res.send({
                            success: true,
                            message: "Payment successful",
                            charge,
                        });
                    });
            },
            { itemPotencyKey }
        )
        .then((result) => res.status(200).json(result))
        .catch((err) => res.status(500).json(err));
});

export default router;
