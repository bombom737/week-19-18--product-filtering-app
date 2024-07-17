import React from 'react';
import './Products.css';

export default function Products({ products }) {
  return (
    <div>
      {products.length > 0 ? (
        <div className='products'>
          {products.map((product, index ) => (
            <div className="product-container" key={index}>
              <img id='product-image' src={product.images[0]}/>
              <div className='product' key={product.id}>
                <h4>{product.title}</h4>
                <p>${product.price}</p> 
                <p>{product.brand}</p> 
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No products found </p>
      )}
    </div>
  );
}
