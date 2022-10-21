import {createStore, combineRedux, applyMiddleware, combineReducers} from "redux"
import thunk from "redux-thunk"
import {composeWithDevTools} from "redux-devtools-extension"
import { productDetailsReducer, productListReducer,productCreateReviewReducer } from "./Reducers/ProductReducers.js"
import { cartReducer } from "./Reducers/CartReducers.js"
import { userDetailsReducer, userLoginReducer, userRegisterReducer, userUpdateProfileReducer } from "./Reducers/userReducers"
import { orderCreateReducer, orderDetailsReducer, orderListMyReducer, orderPayReducer } from "./Reducers/OrderReducers.js"


const reducer = combineReducers({
     productList : productListReducer,
     productDetails : productDetailsReducer,
     productReviewCreate : productCreateReviewReducer,
     cart: cartReducer,
     userLogin: userLoginReducer,
     userRegister: userRegisterReducer,
     userDetails: userDetailsReducer,
     userUpdateProfile: userUpdateProfileReducer,
     orderCreate : orderCreateReducer,
     orderDetails: orderDetailsReducer,
     orderPay : orderPayReducer,
     orderListMy: orderListMyReducer


})

// CART

const cartItemsFromLocalStorage = localStorage.getItem("cartItems") ? JSON.parse(localStorage.getItem("cartItems")) : []

// LOGIN

const userInfoFromLocalStorage = localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")) : null

// SHIPPING

const shippingAddressFromLocalStorage = localStorage.getItem("shippingAddress") ? JSON.parse(localStorage.getItem("shippingAddress")) : {}


const initialState = {
     cart: {
          cartItems: cartItemsFromLocalStorage,
          shippingAddress: shippingAddressFromLocalStorage
     },
     userLogin:{
          userInfo:userInfoFromLocalStorage}
    
}

const middleware = [thunk]

const store = createStore(reducer,initialState,composeWithDevTools(applyMiddleware(...middleware)));

export default store;