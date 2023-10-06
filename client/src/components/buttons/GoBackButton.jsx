import React from 'react';

// Importar React Icons
import { FaArrowLeft } from 'react-icons/fa';

const BackButton = () => {
  const goBack = () => {
    window.history.back();
  };

  return (
    <button onClick={goBack} title='Volver' className='fixed top-4 z-50 bg-details_3 hover:bg-details_2 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg'>
      <FaArrowLeft size={21} />
    </button>
  );
};

export default BackButton;
