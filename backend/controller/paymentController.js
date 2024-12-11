import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SK);

export const paymentIntent = async (req, res) => {
  const { amount } = req.body;
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd'
    })

    return res.json({ clientSecret: paymentIntent.client_secret });
  }
  catch (er) {
    console.log(er.message);
    return res.json({ clientSecret: '' });
  }
}