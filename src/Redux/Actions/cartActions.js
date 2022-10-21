import axios from "axios"
import { CART_ADD_ITEM, CART_REMOVE_ITEM, CART_SAVE_PAYMENT_METHOD, CART_SAVE_SHIPPING_ADDRESS } from "../Constants/CartConstant";
import {URL} from "../Url"


// ADD PRODUCT 
export const addToCart = (id,qty) => async(dispath, getState) => {

    const {data} = await axios(`${URL}/api/products/${id}`);
    dispath({
        type:CART_ADD_ITEM,
        payload: {
            product: data._id,
            name: data.name,
            image: data.image,
            price: data.price,
            countInStock:data.countInStock,
            qty,

        }
    })
    console.log(getState())
    localStorage.setItem("cartItems",JSON.stringify(getState().cart.cartItems))
}

// REMOVE PRODUCT FROM CART

export const removFromCart = (id) => (dispath,getState) => {
    dispath({
        type: CART_REMOVE_ITEM,
        payload: id,
    })

    localStorage.setItem("cartItems",JSON.stringify(getState().cart.cartItems))

}


// SAVE SHIPPING ADDRESS

export const saveShippingAddress = (data) => (dispath) => {
    dispath({
        type: CART_SAVE_SHIPPING_ADDRESS,
        payload: data,
    })

    localStorage.setItem("shippingAddress",JSON.stringify(data))

}

// SAVE PAYMENT

export const savePaymentMethod = (data) => (dispath) => {
    dispath({
        type: CART_SAVE_PAYMENT_METHOD,
        payload: data,
    })

    localStorage.setItem("paymentMethod",JSON.stringify(data))

}

