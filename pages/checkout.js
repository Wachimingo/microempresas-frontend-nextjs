import { useRouter } from "next/router";
import React, { useState, useEffect, useContext } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../components/CheckoutForm";
import AuthContext from '../context/authContext';
const classes = require("./../styles/checkout.module.css");

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// loadStripe is initialized with a fake API key.
const stripePromise = loadStripe("pk_test_51JoWSEBRTpO3u3NE9725VJ4hgW8mDQM25unYxqNh7lC5SZfqKGQIkne1UPdL7Zi16t80mcsstnhHha0m0YlkMyl900VHTkHBcB");

export default function checkout(props) {
    const router = useRouter();
    const ids = router.query;
    const [clientSecret, setClientSecret] = useState("");
    const { session } = useContext(AuthContext);

    useEffect(() => {
      // console.log(ids)
        // Create PaymentIntent as soon as the page loads
        fetch('/api/checkout', {
          method: "POST",
          headers: { 
                Authorization: `${session.token}`,
              "Content-Type": "application/json"
             },
          body: JSON.stringify({ ids }),
        })
          .then((res) => res.json())
        //   .then((res) => {console.log(res)})
          .then((res) => setClientSecret(res.data.clientSecret));
      }, []);

      const appearance = {
        theme: 'stripe',
      };
      const options = {
        clientSecret,
        appearance,
      };

    return (
        <div className="App">
            {/* {console.log(clientSecret)} */}
          {clientSecret && (
            <Elements options={options} stripe={stripePromise}>
              <CheckoutForm />
            </Elements>
          )}
        </div>
      );
}
