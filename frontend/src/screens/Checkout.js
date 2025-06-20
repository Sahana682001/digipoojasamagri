import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";

// Initialize Stripe with your public key

const CheckoutPage = () => {
    const stripePromise = loadStripe("pk_test_51Rat03C68u3GMHdKabDHs9vwDBwVAl2k1vMPUpdPv2EwUwpZzQFYqErn5vFvYSiTemejvm5xF3ZPDNQhYbJsMXLY00AjQbyfbe");

  return (
    <>
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
    </>
  );
};

export default CheckoutPage;