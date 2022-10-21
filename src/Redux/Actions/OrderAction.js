import { ORDER_CREATE_FAIL, ORDER_CREATE_REQUEST, ORDER_CREATE_SUCCESS, ORDER_DETAIL_FAIL, ORDER_DETAIL_REQUEST, ORDER_DETAIL_SUCCESS, ORDER_LIST_MY_FAIL, ORDER_LIST_MY_REQUEST, ORDER_LIST_MY_SUCCESS, ORDER_PAY_FAIL, ORDER_PAY_REQUEST, ORDER_PAY_SUCCESS } from "../Constants/OrderConstant"
import {CART_CLEAR_ITEMS}from "../Constants/CartConstant"
import axios from "axios"
import { logout } from "./userActions"
import {URL} from "../Url"

// CREATE ORDER
export const createOrder = (order) => async(dispatch,getState) => {
    try {
        dispatch({type:ORDER_CREATE_REQUEST})
        const {userLogin:{userInfo},}=getState()

        const config = {
            headers: {
                "Content-Type" : "application/json",
                Authorization : `Bearer ${userInfo.token}`
            }
        }
        const {data} = await axios.post(`${URL}/api/orders`,order,config)

        dispatch({type:ORDER_CREATE_SUCCESS,payload:data})
        dispatch({type: CART_CLEAR_ITEMS})

        localStorage.removeItem("cartItems")
        
    } catch (error) {
        const message = error.response && error.response.data.message ? error.response.data.message : error.message
        if(message === "Not authorized, no token"){
            dispatch(logout())
        }
        dispatch({
            type: ORDER_CREATE_FAIL,
            payload: message,
        })
    }

}

// ORDER DETAILs
export const getOrderDetails = (id) => async(dispatch,getState) => {
    try {
        dispatch({type:ORDER_DETAIL_REQUEST})
        const {userLogin:{userInfo},}=getState()

        const config = {
            headers: {
                Authorization : `Bearer ${userInfo.token}`
            }
        }
        const {data} = await axios.get(`${URL}/api/orders/${id}`,config)

        dispatch({type:ORDER_DETAIL_SUCCESS,payload:data})
        
        
    } catch (error) {
        const message = error.response && error.response.data.message ? error.response.data.message : error.message
        if(message === "Not authorized, no token"){
            dispatch(logout())
        }
        dispatch({
            type: ORDER_DETAIL_FAIL,
            payload: message,
        })
    }

}


// ORDER PAY
export const payOrder = (orderId,paymentResult) => async(dispatch,getState) => {
    try {
        dispatch({type:ORDER_PAY_REQUEST})
        const {userLogin:{userInfo},}=getState()


        const config = {
            headers: {
                "Content-Type" : "application/json",
                Authorization : `Bearer ${userInfo.token}`
            }
        }
        const {data} = await axios.put(`${URL}/api/orders/${orderId}/pay`,paymentResult,config)

        dispatch({type:ORDER_PAY_SUCCESS,payload:data})

        
    } catch (error) {
        const message = error.response && error.response.data.message ? error.response.data.message : error.message
        if(message === "Not authorized, no token"){
            dispatch(logout())
        }
        dispatch({
            type: ORDER_PAY_FAIL,
            payload: message,
        })
    }

}


// USER ORDERS
export const listMyOrders = () => async(dispatch,getState) => {
    try {
        dispatch({type:ORDER_LIST_MY_REQUEST})
        const {userLogin:{userInfo},}=getState()


        const config = {
            headers: {
                Authorization : `Bearer ${userInfo.token}`
            }
        }
        const {data} = await axios.get(`${URL}/api/orders/`,config)

        dispatch({type:ORDER_LIST_MY_SUCCESS,payload:data})

        
    } catch (error) {
        const message = error.response && error.response.data.message ? error.response.data.message : error.message
        if(message === "Not authorized, no token"){
            dispatch(logout())
        }
        dispatch({
            type: ORDER_LIST_MY_FAIL,
            payload: message,
        })
    }

}