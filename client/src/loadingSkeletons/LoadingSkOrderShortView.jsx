import React from 'react';
import Skeleton from 'react-loading-skeleton';

const LoadingSkOrderShortView = () => {
  return (
    <div className='Tarjeta relative animate-pulse'>
        {/* Titulo */}
        <div className='Tarjeta_field bg-gray-300 h-14 animate-pulse'>
            <Skeleton />
        </div>
        {/* Imagen Producto */}
        <div className='Tarjeta_field bg-gray-300 my-3
          w-16 sm:w-28 md:w-30 lg:w-16 xl:w-14 2xl:w-20
          h-16 sm:h-28 md:h-30 lg:h-16 xl:h-14 2xl:h-20'>
            <div className='aspect-w-1 aspect-h-1'>
                <Skeleton />
            </div>
        </div>
        {/* Fecha Entrega */}
        <div className='Tarjeta_field bg-gray-300 animate-pulse'>
            <Skeleton/>
        </div>
        {/* Envio o Retira */}
        <div className='Tarjeta_field bg-gray-300 animate-pulse'>
            <Skeleton />
        </div>
        {/* Direccion */}
        <div className='Tarjeta_field bg-gray-300 h-20 animate-pulse'>
            <Skeleton />
        </div>
        {/* Total */}
        <div className='Tarjeta_field bg-gray-300 animate-pulse'>
            <Skeleton />
        </div>
        {/* Botones */}
        <div className='flex mt-12'>
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className='Card-icon bg-gray-300 w-5 h-5 mr-2 animate-pulse'>
                <Skeleton />
              </div>
            ))}
        </div>
    </div>
  );
};

export default LoadingSkOrderShortView;
