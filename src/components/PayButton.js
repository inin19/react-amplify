import React from 'react';
// import { Notification, Message } from "element-react";
// import StripeCheckout from 'react-stripe-checkout';
import { API } from 'aws-amplify';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const stripeConfig = {
  currency: 'USD',
  publishableAPIKey:
    'pk_test_51HmMhTClJ2ILqE1IrMUUl9id9fwnQQfZLL6Fl7bH59hIW4Ynv1C6ALrfuCP9DHiCuUrTx4eQblAtB79eOUaX9KT300csHOn85E',
};

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(stripeConfig.publishableAPIKey);

const PayButton = ({ product, user }) => {
  const handleCharge = async (token) => {
    try {
      const result = await API.post('orderLambda', '/charge', {
        body: {
          token,
          charge: {
            currency: stripeConfig.currency,
            amount: product.price,
            description: product.description,
          },
        },
      });

      console.log(result);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    // <StripeCheckout
    //   token={handleCharge}
    //   email={user.attributes.email}
    //   name={product.description}
    //   amount={product.price}
    //   shippingAddress={product.shipped}
    //   billingAddress={product.shipped}
    //   currency={stripeConfig.currency}
    //   stripeKey={stripeConfig.publishableAPIKey}
    //   locale="auto"
    //   allowRememberMe={false}
    // />

    // <Elements stripe={stripePromise}>
    //   <MyCheckoutForm />
    // </Elements>

    <div>'Hye'</div>
  );
};

export default PayButton;
