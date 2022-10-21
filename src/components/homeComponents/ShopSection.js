import React, { useEffect, useState} from "react";
import { Link } from "react-router-dom";
import Rating from "./Rating";
import Pagination from "./pagination";
// import products from "../../data/Products";
import axios from "axios";
import {useDispatch, useSelector } from "react-redux"
import { listProduct } from "../../Redux/Actions/ProductActions";
import Loading from "../LoadingError/Loading";
import Message from "../LoadingError/Error";


const ShopSection = (props) => {
  const {keyword,pagenumber} = props

  const dispatch = useDispatch();

  const productList = useSelector((state) => state.productList)
  const {loading,error, products,page,pages} = productList;

  useEffect(()=>{
    dispatch(listProduct(keyword,pagenumber))
  },[dispatch,keyword,pagenumber])

  return (
    <>
      <div className="container">
        <div className="section">
          <div>
            <div>
              <div className="shopcontainer row">
              {
                loading ? (<Loading />) : error ? (<Message variant="alert-danger">{error}</Message>) :
                (
                  <>
                  {products.map((product) => (
                  <div className="shop col-lg-4 col-md-6 col-sm-6" key={product._id}>
                    <div className="border-product">
                      <Link to={`/products/${product._id}`}>
                        <div className="shopBack">
                          <img src={product.image} alt={product.name} />
                        </div>
                      </Link>
                      <div className="shoptext">
                        <p>
                          <Link to={`/products/${product._id}`}> {product.name} </Link>
                        </p>
                        <Rating value={product.rating} text={`${product.numReviews} reviews`}/>
                        <h3>${product.price}</h3>
                      </div>
                    </div>
                  </div>
                ))}
                  </>
                )
              }

                
                {/* Pagination */}
                <Pagination pages={pages} page={page} keyword={keyword ?  keyword : ""}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShopSection;
