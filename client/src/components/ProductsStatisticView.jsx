import React, { useState, useEffect } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';


const ProductStatisticView = ({ products }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    setCurrentSlide(0);
  }, [products]);

  if (!products || products.length === 0) {
    return <p>Sin productos vendidos</p>;
  }

  const CustomPrevArrow = ({ onClick }) => (
    <button
      className="SliderArrows left-0 "
      onClick={onClick}
    >
      <FaChevronLeft size={25} />
    </button>
  );
  
  const CustomNextArrow = ({ onClick }) => (
    <button
      className="SliderArrows right-0"
      onClick={onClick}
    >
      <FaChevronRight size={25} />
    </button>
  );

  const renderCustomIndicator = (onClickHandler, isSelected) => {
    const indicatorStyles = `inline-block mx-2 rounded-full w-3 h-3 ${
      isSelected ? 'bg-gray-600' : 'bg-gray-400'
    }`;

    return (
      <span
        className={indicatorStyles}
        onClick={onClickHandler}
      />
    );
  };
  

  return (
    <div className="w-3/4 max-w-sm">
      <Carousel
        showIndicators={true}
        showStatus={false}
        selectedItem={currentSlide}
        showThumbs={false}
        showArrows={true}
        infiniteLoop={true}
        onChange={(index) => setCurrentSlide(index)}
        renderArrowPrev={(onClickHandler, hasPrev, label) =>
          hasPrev && (
            <CustomPrevArrow
              onClick={onClickHandler}
              aria-label={`Anterior ${label}`}
            />
          )
        }
        renderArrowNext={(onClickHandler, hasNext, label) =>
          hasNext && (
            <CustomNextArrow
              onClick={onClickHandler}
              aria-label={`Siguiente ${label}`}
            />
          )
        }
        renderIndicator={renderCustomIndicator}
      >
        {products.map((product) => (
          <div key={product.id} className="p-3 pb-12">
            <div className="relative bg-details_3 rounded-md font-bold text-white text-center p-2">
              <h3 className="pb-2">{product.productName}</h3>
              <img className="" src={product.imgURL} alt={product.productName} />
              <p className="pt-2 pl-2 text-left">Precio: ${product.price}</p>
              <p className="CantidadProductoMasVendido bg-green-500">{product.totalQuantity}</p>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default ProductStatisticView;
