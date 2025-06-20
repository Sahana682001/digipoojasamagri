// src/screens/PaymentScreen.js
import { useState } from "react";
import { useDispatch } from "react-redux";
import { savePaymentMethod } from "../redux/actions/cartActions";
import useLogin from "../utils/hooks/useLogin";
import "./PaymentScreen.css";

const PaymentScreen = ({ history }) => {
  const { loginInfo } = useLogin();
  const [paymentMethod, setPaymentMethod] = useState("PayPal");

  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    history.push("/placeorder");
  };

  if (loginInfo.loading) return <h1>Loading.....</h1>;
  else if (!loginInfo.loading && loginInfo.isLogin)
    return (
      <div className="payment-container">
        <h1 className="payment-header">Payment Method</h1>
        <form className="payment-form" onSubmit={submitHandler}>
          <div className="payment-method-group">
            <label className="method-label">Select Method</label>
            
            <div className="method-option">
              <input
                type="radio"
                id="paypal"
                name="paymentMethod"
                value="PayPal"
                checked={paymentMethod === "PayPal"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <label htmlFor="paypal">PayPal or Credit Card</label>
            </div>
            
            <div className="method-option">
              <input
                type="radio"
                id="free"
                name="paymentMethod"
                value="Free"
                checked={paymentMethod === "Free"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <label htmlFor="free">Free (No payment required)</label>
            </div>
          </div>

          <button type="submit" className="submit-button">Continue</button>
        </form>
      </div>
    );
};

export default PaymentScreen;