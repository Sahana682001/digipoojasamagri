// src/redux/reducers/orderReducer.js
import * as actionTypes from '../constants/orderConstants'

const initialState = {
  loading: false,
  error: null,
  success: false,
  order: null,
orderListMy: {
    loading: false,
    orders: [],
    error: null
  },
};

export const orderCreateReducer = (state = {initialState}, action) => {
  switch (action.type) {
    case actionTypes.ORDER_CREATE_REQUEST:
      return { ...state, loading: true }
    case actionTypes.ORDER_CREATE_SUCCESS:
      return { ...state, loading: false, success: true, order: action.payload }
    case actionTypes.ORDER_CREATE_FAIL:
      return { ...state, loading: false, error: action.payload }
    default:
      return state
  }
}


export const orderDetailsReducer = (
  state = { loading: true, orderItems: [], shippingAddress: {} },
  action
) => {
  switch (action.type) {
    case actionTypes.ORDER_DETAILS_REQUEST:
      return { ...state, loading: true }
    case actionTypes.ORDER_DETAILS_SUCCESS:
      return { loading: false, order: action.payload }
    case actionTypes.ORDER_DETAILS_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}


export const ordersReducer = (state = { orders: [] }, action) => {
  switch (action.type) {
    case 'ORDER_LIST_MY_REQUEST':
      return { loading: true, orders: [] };
    case 'ORDER_LIST_MY_SUCCESS':
      return { 
        loading: false, 
        orders: Array.isArray(action.payload) ? action.payload : JSON.parse(action.payload)
      };
    case 'ORDER_LIST_MY_FAIL':
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}