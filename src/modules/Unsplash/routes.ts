import { Router } from "express";
import dotenv from "dotenv";

// const { Router } = require("express");

const router: Router = Router();

dotenv.config();

router.get("/apikey", (req, res) => {
    const key = {
        key: process.env.UNSPLASH_ACCESS_KEY,
    };
    res.status(200).send(key);
    return;
});

export default router;
