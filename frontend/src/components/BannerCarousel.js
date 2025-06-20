import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './BannerCarousel.css';

const BannerCarousel = ({ banners, autoPlay = true, interval = 5000, showControls = true, showIndicators = true }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay) return;

    const timer = setInterval(() => {
      goToNext();
    }, interval);

    return () => clearInterval(timer);
  }, [currentIndex, autoPlay, interval]);

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === banners.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToPrev = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? banners.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className="carousel-container">
      <div className="carousel-slides" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        {banners.map((banner, index) => (
          <div key={index} className="carousel-slide">
            <img 
              src={banner.imageUrl} 
              alt={banner.altText || `Banner ${index + 1}`} 
              className="carousel-image"
            />
            {banner.caption && (
              <div className="carousel-caption">
                <h3>{banner.caption.title}</h3>
                <p>{banner.caption.description}</p>
                {banner.caption.buttonText && (
                  <button className="carousel-button">
                    {banner.caption.buttonText}
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {showControls && (
        <>
          <button className="carousel-control prev" onClick={goToPrev}>
            &#10094;
          </button>
          <button className="carousel-control next" onClick={goToNext}>
            &#10095;
          </button>
        </>
      )}

      {showIndicators && (
        <div className="carousel-indicators">
          {banners.map((_, index) => (
            <span
              key={index}
              className={`indicator ${index === currentIndex ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

BannerCarousel.propTypes = {
  banners: PropTypes.arrayOf(
    PropTypes.shape({
      imageUrl: PropTypes.string.isRequired,
      altText: PropTypes.string,
      caption: PropTypes.shape({
        title: PropTypes.string,
        description: PropTypes.string,
        buttonText: PropTypes.string,
      }),
    })
  ).isRequired,
  autoPlay: PropTypes.bool,
  interval: PropTypes.number,
  showControls: PropTypes.bool,
  showIndicators: PropTypes.bool,
};

export default BannerCarousel;