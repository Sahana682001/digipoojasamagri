import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const CheckoutForm = ({cartItems, currentUserId}) => {
  const stripe = useStripe();
  const elements = useElements();
  const history = useHistory();

const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      alert('Stripe is not ready yet');
      return;
    }

    try {
      // Create Payment Intent
      const response = await fetch('http://localhost:3000/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          amount: 5000, // ₹50.00
        //   amount: calculateTotalAmount(cartItems), // Calculate from cart items
          items: cartItems, // Your cart items
          userId: currentUserId // Current user ID
        }),
      });

      const data = await response.json();
      
      if (!data.success || !data.clientSecret) {
        throw new Error(data.error || 'Payment failed');
      }

      // Confirm Payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        data.clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement),
          }
        }
      );

      if (error) throw error;
      
      if (paymentIntent.status === 'succeeded') {
        // Create order in your database
        const orderResponse = await fetch('http://localhost:3000/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            paymentId: paymentIntent.id,
            amount: paymentIntent.amount,
            items: cartItems,
            userId: currentUserId
          }),
        });

        if (orderResponse.ok) {
          history.push('/order-success', { 
            state: { 
              orderId: orderResponse.data.id,
              amount: paymentIntent.amount / 100 
            } 
          });
        }
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert(`Payment failed: ${error.message}`);
    }
  };
  // Helper function to calculate total amount
  const calculateTotalAmount = (items) => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };


  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" disabled={!stripe}>
        Pay Now
      </button>
    </form>
  );
};

export default CheckoutForm;