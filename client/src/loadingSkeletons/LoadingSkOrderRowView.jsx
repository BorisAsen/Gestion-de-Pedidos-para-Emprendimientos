import React from 'react';
import Skeleton from 'react-loading-skeleton';

const LoadingSkOrderRowView = () => {
  return (
    <div className='animate-pulse flex justify-between'>
      {/* Contenido */}
      <div className='Tarjeta_field mb-1 w-full bg-gray-300 h-9 animate-pulse'>
        <Skeleton />
      </div>
  </div>
  );
};

export default LoadingSkOrderRowView;
