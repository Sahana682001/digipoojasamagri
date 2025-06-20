import * as actionTypes from '../constants/cartConstants'
import {Api} from '../../utils/Api';
import {convertToCartData} from '../../utils/utils.function'

export const addToCart = (id, qty) => async dispatch => {
  const {data} = await Api.getRequest(`/api/products/${id}`)
  const product = JSON.parse(data)
  // console.log(product)
  dispatch({
    type: actionTypes.ADD_TO_CART,
    payload: {
      product: product._id,
      name: product.name,
      imageUrl: product.imageUrl,
      price: product.price,
      countInStock: product.countInStock,
      qty,
    },
  })

  Api.postRequest('/api/cart', {productId: id, count: qty})
}

export const removeFromCart =
  ({pId, _id}) =>
  dispatch => {
    dispatch({
      type: actionTypes.REMOVE_FROM_CART,
      payload: pId,
    })
    Api.DeleteRequest('/api/cart/' + _id)
  }

export const fetchCart = () => async dispatch => {
  try {
    const {data: strigifyData} = await Api.getRequest(`/api/cart/`)
    // console.log({strigifyData})
    const {carts} = JSON.parse(strigifyData)
    // console.log(carts)

    dispatch({
      type: actionTypes.FETCH_MY_CART,
      payload: {
        carts: convertToCartData(carts),
      },
    })
  } catch (e) {
    console.log('EROROR :  ', e)
  }
}

export const saveShippingAddress = (data) => (dispatch) => {
  dispatch({
    type: actionTypes.CART_SAVE_SHIPPING_ADDRESS,
    payload: data,
  })

  // Save to localStorage if needed
  localStorage.setItem('shippingAddress', JSON.stringify(data))
}

export const savePaymentMethod = (data) => (dispatch) => {
  dispatch({
    type: actionTypes.CART_SAVE_PAYMENT_METHOD,
    payload: data,
  })

  // Save to localStorage if needed
  localStorage.setItem('paymentMethod', JSON.stringify(data))
}

export const resetCart = () => (dispatch) => {
  dispatch({ type: 'CART_RESET' });
  localStorage.removeItem('cartItems');
  localStorage.removeItem('shippingAddress');
  localStorage.removeItem('paymentMethod');
};
