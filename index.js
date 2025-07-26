const express = require("express");
const axios = require("axios");
const app = express();
const port = process.env.PORT || 3000;

app.get("/pay", async (req, res) => {
  const consumerKey = process.env.PESAPAL_CONSUMER_KEY;
  const consumerSecret = process.env.PESAPAL_CONSUMER_SECRET;

  try {
    const tokenRes = await axios.post("https://pay.pesapal.com/v3/api/Auth/RequestToken", {
      consumer_key: consumerKey,
      consumer_secret: consumerSecret,
    });

    const token = tokenRes.data.token;

    const orderRes = await axios.post(
      "https://pay.pesapal.com/v3/api/Transactions/SubmitOrderRequest",
      {
        id: "ORDER123",
        currency: "KES",
        amount: 1000,
        description: "Shopify Order #123",
        callback_url: "https://yourshopifystore.com/thank-you",
        notification_id: "YOUR_NOTIFICATION_ID",
        billing_address: {
          email_address: "customer@example.com",
          phone_number: "254712345678",
          first_name: "Sylvia",
          last_name: "Owuor",
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const redirectUrl = orderRes.data.redirect_url;
    res.redirect(redirectUrl);
  } catch (error) {
    console.error(error);
    res.status(500).send("Payment setup failed");
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
