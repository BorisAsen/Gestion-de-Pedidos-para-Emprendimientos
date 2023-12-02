import React from 'react';
import Skeleton from 'react-loading-skeleton';

const LoadingSkProduct = () => {
  return (
    <div className='Tarjeta relative animate-pulse'>
        {/* Titulo */}
        <div className='Tarjeta_field bg-gray-300 animate-pulse'>
            <Skeleton />
        </div>
        {/* Imagen */}
        <div className='Tarjeta_field bg-gray-300 my-3 w-40 h-36 animate-pulse'>
            <Skeleton />
        </div>
        {/* Descripcion */}
        <div className='Tarjeta_field bg-gray-300 h-24 animate-pulse'>
            <Skeleton/>
        </div>
        {/* Precio */}
        <div className='Tarjeta_field bg-gray-300 animate-pulse'>
            <Skeleton />
        </div>
        {/* Botones */}
        <div className='flex mt-5'>
            <div className='Card-icon bg-gray-300 w-5 h-5 mr-2 animate-pulse'>
                <Skeleton />
            </div>
            <div className='Card-icon bg-gray-300 w-5 h-5 animate-pulse'>
                <Skeleton />
            </div>
        </div>
    </div>
  );
};

export default LoadingSkProduct;
