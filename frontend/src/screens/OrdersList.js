import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listMyOrders } from '../redux/actions/orderActions';
import { useHistory } from 'react-router-dom';
import "./OrdersList.css";

const OrdersList = () => {
  const dispatch = useDispatch();
  const history = useHistory(); // Fixed: Added parentheses
  
  // Debug logs
  console.log('Rendering OrdersList component');
  
  const userLogin = useSelector((state) => state.user);
  const { userInfo } = userLogin;
  
  const orderListMy = useSelector((state) => state.orderListMy || {});
  const { 
    loading: loadingOrders = false, 
    error: errorOrders = null, 
    orders = [] 
  } = orderListMy;

  // Debug logs for state
  console.log('Redux orderListMy state:', orderListMy);
  console.log('Orders data:', orders);

  useEffect(() => {
    console.log('useEffect triggered, userInfo:', userInfo);
    if (!userInfo) { // Changed from !userInfo?.isLogin
      history.push('/signin');
    } else {
      dispatch(listMyOrders());
    }
  }, [dispatch, history, userInfo]);

  return (
    <div className="order-list-container">
      <h1 className="order-list-title">My Orders</h1>
      
      {loadingOrders ? (
        <div className="loading-state">Loading your orders...</div>
      ) : errorOrders ? (
        <div className="error-state">{errorOrders}</div>
      ) : (
        <table className="orders-table">
          <thead className="orders-table-header">
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders?.length > 0 ? (
              orders.map((order) => (
                <tr key={order._id} className="orders-table-row">
                  <td className="orders-table-cell">{order._id.substring(0, 8)}...</td>
                  <td className="orders-table-cell">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="orders-table-cell">&#8377;{order.totalPrice.toFixed(2)}</td>
                  <td className="orders-table-cell">
                    <span className={`status-badge ${order.isPaid ? 'status-paid' : 'status-not-paid'}`}>
                      {order.isPaid ? 'Paid' : 'Not Paid'}
                    </span>
                  </td>
                  <td className="orders-table-cell">
                    <span className={`status-badge ${order.isDelivered ? 'status-delivered' : 'status-not-delivered'}`}>
                      {order.isDelivered ? 'Delivered' : 'Processing'}
                    </span>
                  </td>
                  <td className="orders-table-cell">
                    <button 
                      className="details-button"
                      onClick={() => history.push(`/orders/${order._id}`)}
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-orders-message">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrdersList;