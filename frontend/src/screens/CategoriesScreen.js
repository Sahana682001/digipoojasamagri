import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listCategories } from '../redux/actions/categoryActions';
import Message from '../components/Message';
import Loader from '../components/Loader';
import CategoryCard from '../components/CategoryCard';
import './CategoriesScreen.css';

const CategoriesScreen = () => {
  const dispatch = useDispatch();

  const categoryList = useSelector((state) => state.categoryList);
  const { loading, error, categories } = categoryList;

  useEffect(() => {
    dispatch(listCategories());
  }, [dispatch]);

  return (
    <>
      <h1>Product Categories</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
<div className="categories-container">
  <h1 className="categories-title">Product Categories</h1>
  <div className="categories-grid">
    {categories.map((category) => (
      <CategoryCard key={category._id} category={category} />
    ))}
  </div>
</div>
      )}
    </>
  );
};

export default CategoriesScreen;