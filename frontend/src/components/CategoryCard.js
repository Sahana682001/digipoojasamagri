import React from 'react';
import { Link } from 'react-router-dom';
import './CategoryCard.css';

const CategoryCard = ({ category }) => {
  return (
    <div className="category-card">
      <img 
        src={category.image} 
        alt={category.name} 
        className="category-card__image" 
      />
      <div className="category-card__body">
        <h3 className="category-card__name">{category.name}</h3>
        <Link 
          to={`/category/${category._id}`} 
          className="category-card__link"
        >
          View Products
        </Link>
      </div>
    </div>
  );
};

export default CategoryCard;