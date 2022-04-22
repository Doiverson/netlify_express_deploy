const express = require("express");
const serverless = require("serverless-http");

const app = express();
const router = express.Router();

const stripe = require("stripe")('sk_test_Hrs6SAopgFPF0bZXSN3f6ELN');

app.use(express.json());

const calculateOrderAmount = (items) => {
   // Replace this constant with a calculation of the order's amount
   // Calculate the order total on the server to prevent
   // people from directly manipulating the amount on the client
   return 1400;
};

router.post("/create-payment-intent", async (req, res) => {
   const { items } = req.body;

   // Create a PaymentIntent with the order amount and currency
   const paymentIntent = await stripe.paymentIntents.create({
      amount: calculateOrderAmount(items),
      currency: "eur",
      automatic_payment_methods: {
         enabled: true,
      },
   });

   res.send({
      clientSecret: paymentIntent.client_secret,
   });
});

router.get("/", (req, res) => {
   res.send("Fuck you!!!")
});

app.use(`/.netlify/functions/api`, router);

module.exports = app;
module.exports.handler = serverless(app);