import React, { FormEvent, useEffect, useCallback, useState } from "react";
import axios from "axios";
import StripeCheckout from "react-stripe-checkout";

import Button from "../../components/HTML/Button";
import { useToasts } from "../../store/useToasts";

const GiveScreen = () => {
    const [stripeKey, setStripeKey] = useState("");
    const [email, setEmail] = useState("");
    const [amount, setAmount] = useState<number>(0);

    const { addToast } = useToasts();

    const getKey = useCallback(async () => {
        console.log("Called getKey");
        try {
            const { data } = await axios.get("http://localhost:4000/stripe/", {
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "http://localhost:3000",
                    "Access-Control-Allow-Methods":
                        "GET,PUT,POST,DELETE,PATCH,OPTIONS",
                },
            });

            setStripeKey(data.key);
            return;
        } catch {
            addToast({
                message: "Could not get the stripe key",
                type: "error",
            });
            return;
        }
    }, [addToast]);

    useEffect(() => {
        getKey();
    }, [getKey]);

    const makePayment = async (token: any) => {
        console.log("In the front end, in the make payment method");

        const body = {
            token,
            amount,
        };
        console.log("Body: ", body);
        const headers = {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "http://localhost:3000",
            "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
        };
        console.log("Headers: ", { headers, withCredentials: true });

        return await axios.post("http://localhost:4000/stripe/pay", body, {
            headers,
            withCredentials: true,
        });
    };

    return (
        <div>
            <h1>Give</h1>
            <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label htmlFor="amount">Amount</label>
                <input
                    type="number"
                    name="amount"
                    id="amount"
                    value={amount}
                    onChange={(e) => setAmount(parseFloat(e.target.value))}
                />
            </div>
            <div className="form-group">
                <StripeCheckout
                    stripeKey={stripeKey}
                    token={makePayment}
                    amount={amount}
                >
                    <Button>Give!</Button>
                </StripeCheckout>
            </div>
        </div>
    );
};

export default GiveScreen;
