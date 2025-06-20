require("dotenv").config();
const express = require("express");
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const { connectDB } = require("./config/db");
const cors = require("cors");
const stripe = require("stripe")("sk_test_51Rat03C68u3GMHdKo5rTerATMuTDpjUDlhXY3Wtll85DZkrgP2XFcJAQ4CLlDWX09S6efVK2Iv5GW88zm4GafOFg00NEppkdvo");  

connectDB();

const app = express();

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3001', // Your frontend origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.get("/", (req, res) => {
  res.json({ message: "API running..." });
});

app.use("/api/products", productRoutes);
app.use("/api/user", userRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount, items, userId } = req.body; // Add items and userId

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.max(amount, 5000), // Minimum ₹50
      currency: "inr",
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never'
      },
      metadata: { // Add order metadata
        userId: userId,
        items: JSON.stringify(items)
      }
    });

    res.json({ 
      success: true, 
      clientSecret: paymentIntent.client_secret 
    });
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Add webhook for payment completion
app.post('/stripe-webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = 'your_webhook_signing_secret';

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    // Create order in your database here
    console.log('Payment succeeded:', paymentIntent.id);
  }

  res.json({received: true});
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
