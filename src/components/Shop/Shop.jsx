import React, { useEffect, useState } from "react";
import {
  addToDb,
  deleteShoppingCart,
  getShoppingCart,
} from "../../utilities/fakedb";
import Cart from "../Cart/Cart";
import Product from "../Product/Product";
import "./Shop.css";
import { Link, useLoaderData } from "react-router-dom";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const { count } = useLoaderData();
  const [itemParPage, setItemParPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);

  const numberOfPages = Math.ceil(count / itemParPage);

  const pages = [...Array(numberOfPages).keys()];

  useEffect(() => {
    fetch(`http://localhost:5000/products?page=${currentPage}&size=${itemParPage}`)
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, [currentPage, itemParPage]);

  useEffect(() => {
    const storedCart = getShoppingCart();
    const savedCart = [];
    // step 1: get id of the addedProduct
    for (const id in storedCart) {
      // step 2: get product from products state by using id
      const addedProduct = products.find((product) => product._id === id);
      if (addedProduct) {
        // step 3: add quantity
        const quantity = storedCart[id];
        addedProduct.quantity = quantity;
        // step 4: add the added product to the saved cart
        savedCart.push(addedProduct);
      }
      // console.log('added Product', addedProduct)
    }
    // step 5: set the cart
    setCart(savedCart);
  }, [products]);

  const handleAddToCart = (product) => {
    // cart.push(product); '
    let newCart = [];
    // const newCart = [...cart, product];
    // if product doesn't exist in the cart, then set quantity = 1
    // if exist update quantity by 1
    const exists = cart.find((pd) => pd._id === product._id);
    if (!exists) {
      product.quantity = 1;
      newCart = [...cart, product];
    } else {
      exists.quantity = exists.quantity + 1;
      const remaining = cart.filter((pd) => pd._id !== product._id);
      newCart = [...remaining, exists];
    }

    setCart(newCart);
    addToDb(product._id);
  };

  const handleClearCart = () => {
    setCart([]);
    deleteShoppingCart();
  };

  const handleItemParPage = (e) => {
    const value = parseInt(e.target.value);
    setItemParPage(value);
    setCurrentPage(0)
  };

  const handlePvevPage = () =>{
    if(currentPage > 0){
        setCurrentPage( currentPage - 1)
    }
  }

  const handleNextPage = () =>{
    if(currentPage < pages.length -1){
        setCurrentPage(currentPage + 1)
    }
  }

  return (
    <div className="shop-container">
      <div className="products-container">
        {products.map((product) => (
          <Product
            key={product._id}
            product={product}
            handleAddToCart={handleAddToCart}
          ></Product>
        ))}
      </div>
      <div className="cart-container">
        <Cart cart={cart} handleClearCart={handleClearCart}>
          <Link className="proceed-link" to="/orders">
            <button className="btn-proceed">Review Order</button>
          </Link>
        </Cart>
      </div>
      <div className="pagination">
      <div>
        <p>Current Page: {currentPage}</p>
      </div>
        <button onClick={handlePvevPage}>Pver</button>
        {pages.map((page) => (
          <button className={currentPage == page ? 'setelted': ''}key={page} onClick={() => setCurrentPage(page)}>{page}</button>
        ))}
        <select defaultValue={itemParPage} onChange={handleItemParPage}>
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="30">30</option>
        </select>
        <button onClick={handleNextPage}>Next</button>
      </div>
    </div>
  );
};

export default Shop;
