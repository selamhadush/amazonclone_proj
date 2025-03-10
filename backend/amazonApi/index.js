const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const stripe = require("stripe")(process.env.STRIPE_KEY);

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    message: "success!",
  });
});

app.post("/payment/create", async (req, res) => {
  const total = req.query.total;
  try {
    if (total > 0) {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: total,
        currency: "usd",
      });
      // console.log("Payment received.", total);
      res.status(201).json({
        client_secret: paymentIntent.client_secret,
      });
    } else {
      res
        .status(403)
        .json({ message: "Invalid payment. total must be greater than 0." });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating payment intent", error: error.message });
  }
});
app.listen(5000, (err) => {
  if (err) throw err;
  console.log("server runing on port: 5000, http://localhost:5000 ");
});
