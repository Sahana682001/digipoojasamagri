import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getOrderDetails } from '../redux/actions/orderActions';
import { useParams, useHistory } from 'react-router-dom';
import "./OrderDetails.css";
import Loader from '../components/Loader';
import Message from '../components/Message';
import { Link } from 'react-router-dom/cjs/react-router-dom';

const OrderDetails = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { id } = useParams();

  const orderDetails = useSelector((state) => state.orderDetails || {});
  const { 
    loading, 
    error, 
    order 
  } = orderDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (!userInfo) {
      history.push('/signin');
    } else {
      if (!order || order._id !== id) {
        dispatch(getOrderDetails(id));
      }
    }
  }, [dispatch, history, id, order, userInfo]);

  return (
  <div className="order-details-container">
      <div className="navigation-buttons">
        <button onClick={() => history.push(-1)} className="back-button">
          ← Go Back
        </button>
        <Link to="/orders" className="orders-link">
          View All Orders
        </Link>
        <Link to="/" className="home-link">
          Home
        </Link>
      </div>

      <h1 className="order-details-title">Order Details</h1>
      
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <div className="order-summary">
            <div className="order-section">
              <h2>Shipping</h2>
              <p><strong>Name:</strong> {order.user.name}</p>
              <p><strong>Email:</strong> {order.user.email}</p>
              <p>
                <strong>Address:</strong> {order.shippingAddress.address}, {order.shippingAddress.city}, 
                {order.shippingAddress.postalCode}, {order.shippingAddress.country}
              </p>
              <p className={order.isDelivered ? 'delivered' : 'not-delivered'}>
                <strong>Status:</strong> 
                {order.isDelivered 
                  ? ` Delivered on ${new Date(order.deliveredAt).toLocaleDateString()}`
                  : ' Not Delivered'}
              </p>
            </div>

            <div className="order-section">
              <h2>Payment</h2>
              <p><strong>Method:</strong> {order.paymentMethod}</p>
              <p className={order.isPaid ? 'paid' : 'not-paid'}>
                <strong>Status:</strong> 
                {order.isPaid 
                  ? ` Paid on ${new Date(order.paidAt).toLocaleDateString()}`
                  : ' Not Paid'}
              </p>
            </div>

            <div className="order-section">
              <h2>Order Items</h2>
              <div className="order-items">
                {order.orderItems.map((item) => (
                  <div key={item._id} className="order-item">
                    <div className="item-image">
                      <img src={item.image} alt={item.name} />
                    </div>
                    <div className="item-details">
                      <p>{item.name}</p>
                      <p>
                        {item.qty} x ${item.price} = ${(item.qty * item.price).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="order-total">
            <h2>Order Summary</h2>
            <div className="total-row">
              <span>Items</span>
              <span>${order.itemsPrice.toFixed(2)}</span>
            </div>
            <div className="total-row">
              <span>Shipping</span>
              <span>${order.shippingPrice.toFixed(2)}</span>
            </div>
            <div className="total-row">
              <span>Tax</span>
              <span>${order.taxPrice.toFixed(2)}</span>
            </div>
            <div className="total-row grand-total">
              <span>Total</span>
              <span>${order.totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default OrderDetails;