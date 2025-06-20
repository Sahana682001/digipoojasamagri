import {createStore, combineReducers, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'

// Reducers
import {cartReducer} from './reducers/cartReducers'
import {orderCreateReducer, orderDetailsReducer, ordersReducer} from './reducers/orderReducer'
import {
  getProductsReducer,
  getProductDetailsReducer,
} from './reducers/productReducers'
import {userReducer} from './reducers/userReducer'

const reducer = combineReducers({
  cart: cartReducer,
  orderCreate: orderCreateReducer,
  orderDetail: orderDetailsReducer,
  getProducts: getProductsReducer,
  getProductDetails: getProductDetailsReducer,
  user: userReducer,
  orderListMy: ordersReducer,
})

const middleware = [thunk]

const cartItemsInLocalStorage = localStorage.getItem('cart')
  ? JSON.parse(localStorage.getItem('cart'))
  : []

const INITIAL_STATE = {
  cart: {
    cartItems: cartItemsInLocalStorage,
  },
}

const store = createStore(
  reducer,
  INITIAL_STATE,
  composeWithDevTools(applyMiddleware(...middleware)),
)

export default store
