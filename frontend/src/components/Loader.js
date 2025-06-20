// src/components/Loader.js
import React from 'react';
import './Loader.css'; // Optional styling file

const Loader = () => {
  return (
    <div className="loader">
      <div className="spinner"></div>
      <p>Loading...</p>
    </div>
  );
};

export default Loader;