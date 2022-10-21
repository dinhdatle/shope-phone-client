import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "./../components/Header";
import { PayPalButton } from "react-paypal-button-v2";
import { useDispatch, useSelector } from "react-redux";
import { getOrderDetails, payOrder } from "../Redux/Actions/OrderAction";
import Loading from "../components/LoadingError/Loading"
import Message from "../components/LoadingError/Error"
import moment from "moment"
import axios from "axios";
import { ORDER_PAY_RESET } from "../Redux/Constants/OrderConstant";
import {URL} from "../Redux/Url"



const OrderScreen = ({match}) => {
  window.scrollTo(0, 0);
  const dispatch = useDispatch()
  const [sdkReady,setSdkReady] = useState(false)
  const orderId = match.params.id

  const orderDetails = useSelector((state)=>state.orderDetails);
  const {order,loading,error} = orderDetails;
  const orderPay = useSelector((state)=>state.orderPay)
  const {loading:loadingPay,success:successPay,} = orderPay

  const addDecimals = (num) =>{
    return (Math.round(num*100) / 100).toFixed(2)
  }

  //  order.itemsPrice = addDecimals(order.orderItems.reduce((acc,item)=>acc + item.price*item.qty,0))

  useEffect(()=>{
    const addPaypalScript = async() => {
      const {data:clientId} = await axios.get(`${URL}/api/config/paypal`)
      const script = document.createElement("script")
      script.type = "text/javascript"
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`
      script.async = true
      script.onload = () =>{
        setSdkReady(true)
      }
      document.body.appendChild(script)
    }
    if(!order || successPay){
      dispatch({type:ORDER_PAY_RESET})
      dispatch(getOrderDetails(orderId))

    }
    else if(!order.isPaid){
      if(!window.paypal){
        addPaypalScript()
      }
      else{
        setSdkReady(true)
      }
    }
    // dispatch(getOrderDetails(orderId))
  },[dispatch,orderId,successPay,order])

  
  const successPaymentHandler = (paymentResult) => {
    console.log(paymentResult)
    dispatch(payOrder(orderId,paymentResult))
  }
 
  
  return (
    <>
      <Header />
      {
        loading ? (<Loading></Loading>) : error ? (<Message variant="alert-danger" >{error}</Message>) :
        (
          <>
              <div className="container">
                <div className="row  order-detail">
                  <div className="col-lg-4 col-sm-4 mb-lg-4 mb-5 mb-sm-0">
                    <div className="row">
                      <div className="col-md-4 center">
                        <div className="alert-success order-box">
                          <i className="fas fa-user"></i>
                        </div>
                      </div>
                      <div className="col-md-8 center">
                        <h5>
                          <strong>Customer</strong>
                        </h5>
                        <p>{order.user.name}</p>
                        <p>
                          <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* 2 */}
                  <div className="col-lg-4 col-sm-4 mb-lg-4 mb-5 mb-sm-0">
                    <div className="row">
                      <div className="col-md-4 center">
                        <div className="alert-success order-box">
                          <i className="fas fa-truck-moving"></i>
                        </div>
                      </div>
                      <div className="col-md-8 center">
                        <h5>
                          <strong>Order info</strong>
                        </h5>
                        <p>Shipping: {order.shippingAddress.country}</p>
                        <p>Pay method: {order.paymentMethog}</p>

                        {
                          order.isPaid ? (
                            <div className="bg-info p-2 col-12">
                              <p className="text-white text-center text-sm-start">
                                Paid on {moment(order.paidAt).calendar}
                              </p>
                            </div>
                          ) : (
                            <div className="bg-danger p-2 col-12">
                              <p className="text-white text-center text-sm-start">
                                Not paid
                              </p>
                            </div>
                          )
                        }

                        
                      </div>
                    </div>
                  </div>
                  {/* 3 */}
                  <div className="col-lg-4 col-sm-4 mb-lg-4 mb-5 mb-sm-0">
                    <div className="row">
                      <div className="col-md-4 center">
                        <div className="alert-success order-box">
                          <i className="fas fa-map-marker-alt"></i>
                        </div>
                      </div>
                      <div className="col-md-8 center">
                        <h5>
                          <strong>Deliver to</strong>
                        </h5>
                        <p>
                          Address: {order.shippingAddress.city},{" "} {order.shippingAddress.address}, {order.shippingAddress.country} , {order.shippingAddress.postalCode}
                        </p>
                        {
                          order.isDelivered ? 
                          (
                          <div className="bg-danger p-1 col-12">
                            <p className="text-white text-center text-sm-start">
                              Delivered on {moment(order.paidAt).calendar}
                            </p>
                          </div>) :
                        (
                          <div className="bg-danger p-1 col-12">
                            <p className="text-white text-center text-sm-start">
                              Not Delivered
                            </p>
                        </div>
                        )
                        }
                        
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row order-products justify-content-between">
                  <div className="col-lg-8">
                    {order.orderItems.length === 0 ? (
                      <Message variant="alert-info mt-5">Your order is empty</Message>
                    ) : (
                      <>
                        {order.orderItems.map((item,index) => 
                         <div className="order-product row">
                         <div className="col-md-3 col-6">
                           <img src={item.image} alt="product" />
                         </div>
                         <div className="col-md-5 col-6 d-flex align-items-center">
                           <Link to={`/`}>
                             <h6>{item.name}</h6>
                           </Link>
                         </div>
                         <div className="mt-3 mt-md-0 col-6 col-md-2  d-flex align-items-center flex-column justify-content-center ">
                           <h4>QUANTITY</h4>
                           <h6>{item.qty}</h6>
                         </div>
                         <div className="mt-3 mt-md-0 col-md-2 col-6 align-items-end  d-flex flex-column justify-content-center">
                           <h4>SUBTOTAL</h4>
                           <h6>${item.qty * item.price}</h6>
                         </div>
                       </div>

                        )}
                      </>
                    )
                  }
                    {/* <Message variant="alert-info mt-5">Your order is empty</Message> */}

                   

                  </div>

                  {/* total */}
                  <div className="col-lg-3 d-flex align-items-end flex-column mt-5 subtotal-order">
                  <table className="table table-bordered">
                    <tbody>
                      <tr>
                        <td>
                          <strong>Products</strong>
                        </td>
                        <td>${order.itemsPrice}</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Shipping</strong>
                        </td>
                        <td>${order.shippingPrice}</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Tax</strong>
                        </td>
                        <td>${order.taxPrice}</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Total</strong>
                        </td>
                        <td>${order.totalPrice}</td>
                      </tr>
                    </tbody>
                  </table>
                  {
                    !order.isPaid && (
                        <div className="col-12">
                          {loadingPay && <Loading></Loading>}
                          {!sdkReady ? (<Loading></Loading>):( <PayPalButton amount={order.totalPrice} onSuccess={successPaymentHandler} />)}
                         
                        </div>

                    )
                  }
                   
                  </div>
                </div>
              </div>
          </>
        )
      }

      
    </>
  );
};

export default OrderScreen;
