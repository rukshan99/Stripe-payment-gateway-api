var express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const stripe = require('stripe')('<SECRET_TEST_API_KEY>')
app = express(),
port = process.env.PORT || 4000;

app.use(cors());

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

// confirm the paymentIntent
app.post('/pay', async (request, response) => {
    try {
      // Create the PaymentIntent
      let intent = await stripe.paymentIntents.create({
        payment_method: request.body.payment_method_id,
        description: "Test payment",
        amount: request.body.amount * 100,
        currency: 'usd',
        confirmation_method: 'manual',
        confirm: true
      });
      // Send the response to the client
      response.send(generateResponse(intent));
    } catch (e) {
      // Display error on client
      return response.send({ error: e.message });
    }
  });
   
  const generateResponse = (intent) => {
    if (intent.status === 'succeeded') {
      // The payment didn’t need any additional actions and completed!
      // Handle post-payment fulfillment
      return {
        success: true
      };
    } else {
      // Invalid status
      return {
        error: 'Invalid PaymentIntent status'
      };
    }
  };

app.get('/', (req, res) => {
    res.send('Welcome to Stripe payment gateway!');
});

app.listen(port, () => {
    console.log('Server is listening on port ' + port + `\n http://localhost:${port}`);
});