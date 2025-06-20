// components/CategorySlider.js
import React from 'react';
import Slider from 'react-slick';
import Product from './Product';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const CategorySlider = ({ products }) => {
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 5, // Adjust based on screen size
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1600,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className="category-slider">
      <Slider {...settings}>
        {products.map(product => (
          <div key={product._id} className="slider-item">
            <Product
              name={product.name}
              description={product.description}
              price={product.price}
              imageUrl={product.imageUrl}
              productId={product._id}
              compact={true}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default CategorySlider;
