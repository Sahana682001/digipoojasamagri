// src/screens/PlaceOrderScreen.js
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { createOrder } from '../redux/actions/orderActions';
import { resetCart } from '../redux/actions/cartActions'; // Add this import
import Message from '../components/Message';
import Loader from '../components/Loader';
import "./PlaceOrderScreen.css"

const PlaceOrderScreen = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [showSuccess, setShowSuccess] = useState(false);
  
  const cart = useSelector((state) => state.cart || { cartItems: [], shippingAddress: {} });
  const orderCreate = useSelector((state) => state.orderCreate || {});
  const { loading = false, error = null, success = false, order = null } = orderCreate;

  const { itemsPrice, shippingPrice, taxPrice, totalPrice } = useMemo(() => {
    const calculatedItemsPrice = cart.cartItems?.reduce(
      (acc, item) => acc + (item.price || 0) * (item.qty || 0),
      0
    ) || 0;
    
    const calculatedShippingPrice = calculatedItemsPrice > 100 ? 0 : 10;
    const calculatedTaxPrice = Number((0.15 * calculatedItemsPrice).toFixed(2));
    const calculatedTotalPrice = (Number(calculatedItemsPrice) + Number(calculatedShippingPrice) + Number(calculatedTaxPrice));

    return {
      itemsPrice: calculatedItemsPrice,
      shippingPrice: calculatedShippingPrice,
      taxPrice: calculatedTaxPrice,
      totalPrice: calculatedTotalPrice
    };
  }, [cart.cartItems]);

  useEffect(() => {
    if (success && order?._id) {
      setShowSuccess(true);
      // Clear the cart after successful order
      dispatch(resetCart());
      
      // Show success message for 3 seconds before redirecting
      const timer = setTimeout(() => {
        history.push(`/order/${order._id}`);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [success, order, history, dispatch]);

  const validateOrder = (orderData) => {
    if (!orderData.orderItems || orderData.orderItems.length === 0) {
      throw new Error('Your cart is empty');
    }

    orderData.orderItems.forEach(item => {
      if (!item.product && !item._id) {
        throw new Error('Invalid item in cart - missing required fields');
      }
      if ((!item.qty && !item.quantity) || (item.qty < 1 && item.quantity < 1)) {
        throw new Error('Invalid quantity');
      }
      if (!item.price) {
        throw new Error('Price is required');
      }
      if (!item.image && !item.imageUrl) {
        throw new Error('Image is required');
      }
    });

    if (!orderData.shippingAddress?.address || 
        !orderData.shippingAddress?.city ||
        !orderData.shippingAddress?.postalCode ||
        !orderData.shippingAddress?.country) {
      throw new Error('Complete shipping address is required');
    }

    if (!orderData.paymentMethod) {
      throw new Error('Payment method is required');
    }
  };

const placeOrderHandler = async () => {
  try {
    const orderData = {
      orderItems: cart.cartItems.map(item => ({
        name: item.name,
        qty: item.qty,
        image: item.imageUrl || item.image,
        price: item.price,
        product: item.product || item._id,
        _id: item.product || item._id
      })),
      shippingAddress: cart.shippingAddress,
      paymentMethod: cart.paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    };
    
    validateOrder(orderData);
    await dispatch(createOrder(orderData));
  history.push('/orders');
    // Navigate to orders page after successful order creation
    // navigate('/orders');
    
  } catch (error) {
    console.error('Order validation failed:', error.message);
    dispatch({ type: 'ORDER_CREATE_FAIL', payload: error.message });
  }
};

  return (
    <div className="placeorder">
      {showSuccess && (
        <Message variant="success">
          Order placed successfully! Redirecting to your order...
        </Message>
      )}
      
      {error && <Message variant="danger">{error}</Message>}
      
      <div className="placeorder__left">
        <div>
          <h2>Shipping</h2>
          <p>
            <strong>Address:</strong>
            {cart.shippingAddress.address}, {cart.shippingAddress.city}{" "}
            {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
          </p>
        </div>

        <div>
          <h2>Payment Method</h2>
          <p>
            <strong>Method:</strong>
            {cart.paymentMethod}
          </p>
        </div>

        <div>
          <h2>Order Items</h2>
          {cart.cartItems.length === 0 ? (
            <Message>Your cart is empty</Message>
          ) : (
            <div>
              {cart.cartItems.map((item, index) => (
                <div key={index}>
                  <img src={item.imageUrl} alt={item.name} />
                  <p>{item.name}</p>
                  <p>
                    {item.qty} x &#8377;{item.price} = &#8377;{(item.qty * item.price).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="placeorder__right">
        <div className="order-summary">
          <h2>Order Summary</h2>
          <div>
            <span>Items</span>
            <span>&#8377;{itemsPrice.toFixed(2)}</span>
          </div>
          <div>
            <span>Shipping</span>
            <span>&#8377;{shippingPrice.toFixed(2)}</span>
          </div>
          <div>
            <span>Tax</span>
            <span>&#8377;{taxPrice.toFixed(2)}</span>
          </div>
          <div>
            <span>Total</span>
            <span>&#8377;{totalPrice.toFixed(2)}</span>
          </div>
        </div>

        <button
          onClick={placeOrderHandler}
          disabled={cart.cartItems.length === 0 || loading}
          className="place-order-btn"
        >
          {loading ? 'Processing...' : 'Place Order'}
        </button>
      </div>
    </div>
  );
};

export default PlaceOrderScreen;