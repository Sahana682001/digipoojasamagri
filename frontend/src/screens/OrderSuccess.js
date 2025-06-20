import { useLocation } from 'react-router-dom';

const OrderSuccess = () => {
  const location = useLocation();
  const { orderId, amount } = location.state || {};

  return (
    <div className="order-success">
      <h2>Payment Successful!</h2>
      <p>Order ID: {orderId}</p>
      <p>Amount: ₹{amount}</p>
      <button onClick={() => window.location.href='/'}>
        Continue Shopping
      </button>
    </div>
  );
};

export default OrderSuccess;