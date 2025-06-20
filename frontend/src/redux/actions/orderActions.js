import { getToken } from '../../utils/localstorage';
import {
  ORDER_CREATE_REQUEST,
  ORDER_CREATE_SUCCESS,
  ORDER_CREATE_FAIL,
  ORDER_DETAILS_REQUEST,
  ORDER_DETAILS_SUCCESS,
  ORDER_DETAILS_FAIL
} from '../constants/orderConstants';
import { Api } from '../../utils/Api';

export const createOrder = (order) => async (dispatch, getState) => {
  try {
    dispatch({ type: ORDER_CREATE_REQUEST });

    // Get token - simplified approach
    const token = getToken() || getState().user?.userInfo?.token;
    if (!token) throw new Error('User not authenticated');

    const { statusCode, data } = await Api.postRequest('/api/orders', order, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (statusCode === 201) {
      dispatch({
        type: ORDER_CREATE_SUCCESS,
        payload: typeof data === 'string' ? JSON.parse(data) : data
      });
    } else {
      throw new Error(data.message || 'Order creation failed');
    }
  } catch (error) {
    console.error('Order creation error:', error);
    dispatch({
      type: ORDER_CREATE_FAIL,
      payload: error.message
    });
  }
};

export const getOrderDetails = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: ORDER_DETAILS_REQUEST });

    const token = getToken() || getState().user?.userInfo?.token;
    if (!token) throw new Error('User not authenticated');

    const { data } = await Api.getRequest(`/api/orders/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include'
    });

    dispatch({
      type: ORDER_DETAILS_SUCCESS,
      payload: typeof data === 'string' ? JSON.parse(data) : data
    });
  } catch (error) {
    console.error('Order details error:', error);
    dispatch({
      type: ORDER_DETAILS_FAIL,
      payload: error.response?.data?.message || error.message
    });
  }
};

// Add to src/redux/actions/orderActions.js
export const listMyOrders = () => async (dispatch, getState) => {
  try {
    dispatch({ type: 'ORDER_LIST_MY_REQUEST' });

    const token = getToken() || getState().userLogin?.userInfo?.token;
    const { data } = await Api.getRequest('/api/orders', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    // Ensure we're dispatching an array
    const orders = Array.isArray(data) ? data : 
                 (data.orders ? data.orders : JSON.parse(data));
    
    dispatch({
      type: 'ORDER_LIST_MY_SUCCESS',
      payload: orders
    });
  } catch (error) {
    dispatch({
      type: 'ORDER_LIST_MY_FAIL',
      payload: error.response?.data?.message || error.message
    });
  }
};