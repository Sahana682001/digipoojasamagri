// src/screens/OrderScreen.js
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOrderDetails } from "../redux/actions/orderActions";
import useLogin from "../utils/hooks/useLogin";
import Loader from "../components/Loader";
import Message from "../components/Message";

const OrderScreen = ({ match }) => {
  const orderId = match.params.id;
  const dispatch = useDispatch();
  const { loginInfo } = useLogin();
const orderCreate = useSelector((state) => state.orderCreate || {});
  const orderDetails = useSelector((state) => state.orderDetails);
  // const { order, loading, error } = orderDetails;
const { loading = false, error = null, success = false, order = null } = orderCreate;
  useEffect(() => {
    if (!order || order._id !== orderId) {
      dispatch(getOrderDetails(orderId));
    }
  }, [dispatch, order, orderId]);

  if (loginInfo.loading) return <h1>Loading.....</h1>;
  else if (!loginInfo.loading && loginInfo.isLogin)
    return loading ? (
      <Loader />
    ) : error ? (
      <Message variant="danger">{error}</Message>
    ) : (
      <div className="order">
        <h1>Order {order._id}</h1>
        <div>
          <h2>Shipping</h2>
          <p>
            <strong>Name: </strong> {order.user.name}
          </p>
          <p>
            <strong>Email: </strong>{" "}
            <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
          </p>
          <p>
            <strong>Address:</strong>
            {order.shippingAddress.address}, {order.shippingAddress.city}{" "}
            {order.shippingAddress.postalCode}, {order.shippingAddress.country}
          </p>
          {order.isDelivered ? (
            <Message variant="success">
              Delivered on {order.deliveredAt}
            </Message>
          ) : (
            <Message variant="danger">Not Delivered</Message>
          )}
        </div>

        <div>
          <h2>Payment Method</h2>
          <p>
            <strong>Method: </strong>
            {order.paymentMethod}
          </p>
          {order.isPaid ? (
            <Message variant="success">Paid on {order.paidAt}</Message>
          ) : (
            <Message variant="danger">Not Paid</Message>
          )}
        </div>

        <div>
          <h2>Order Items</h2>
          {order.orderItems.length === 0 ? (
            <Message>Order is empty</Message>
          ) : (
            <div>
              {order.orderItems.map((item, index) => (
                <div key={index}>
                  <img src={item.image} alt={item.name} />
                  <p>{item.name}</p>
                  <p>
                    {item.qty} x &#8377;{item.price} = &#8377;{item.qty * item.price}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2>Order Summary</h2>
          <div>
            <p>Items</p>
            <p>&#8377;{order.itemsPrice}</p>
          </div>
          <div>
            <p>Shipping</p>
            <p>&#8377;{order.shippingPrice}</p>
          </div>
          <div>
            <p>Tax</p>
            <p>&#8377;{order.taxPrice}</p>
          </div>
          <div>
            <p>Total</p>
            <p>&#8377;{order.totalPrice}</p>
          </div>
        </div>
      </div>
    );
};

export default OrderScreen;