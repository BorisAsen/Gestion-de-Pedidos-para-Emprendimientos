import React from 'react';

const ProductView = ({ product }) => {
    // Si el producto no existe, se muestra un mensaje
    if (!product) {
        return <p>Sin productos vendidos</p>;
      }
    return (
        <div className="bg-details_3 w-3/4 rounded-md font-bold text-white text-center p-2">
        <h3 className='pb-2'>{product.productName}</h3>
        <img className=' ' src={product.imgURL} alt={product.productName} />
        <p className='pt-2 text-left'>Precio: ${product.price}</p>
        </div>
    );
};

export default ProductView;
