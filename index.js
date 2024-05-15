const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 6001;
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);


const verifyToken = require('./api/middlewares/verifyToken')

app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin; allow-popups");
  next();
});

// Middleware
app.use(cors());
app.use(express.json());

// mongodb config using mongoose
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.j3tto8r.mongodb.net/foodie-client?retryWrites=true&w=majority&appName=Cluster0`
  )
  .then(
    console.log("MongoDB connected successfully!")
  )
  .catch((error) => console.log("Error connecting to MongoDB", error));


  // jwt authentication
  app.post('/jwt', async(req, res)=>{
    const user = req.body;
    const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1d"
    })
    res.send({token})
  })

 


// import routes
const menuRoutes = require("./api/routes/menuRoutes")
const cartRoutes = require('./api/routes/cartRoutes')
const userRoutes = require('./api/routes/userRoutes')
const paymentRoutes = require('./api/routes/paymentRoutes')
app.use("/menu", menuRoutes)
app.use("/carts", cartRoutes)
app.use('/users', userRoutes)
app.use('/payments', paymentRoutes)

// stripe payment routes
app.post("/create-payment-intent", async (req, res) => {
  const { price } = req.body;
  const amount = price*100;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: "usd",
    payment_method_types: ["card"]
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    // automatic_payment_methods: {
    //   enabled: true,
    // },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});


app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
