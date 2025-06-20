import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__content">
        <div className="footer__section">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/categories">Categories</Link></li>
            <li><Link to="/cart">Cart</Link></li>
          </ul>
        </div>

        <div className="footer__section">
          <h3>Customer Service</h3>
          <ul>
            <li><Link to="/contact">Contact Us</Link></li>
            <li><Link to="/faq">FAQ</Link></li>
            <li><Link to="/returns">Returns Policy</Link></li>
            <li><Link to="/shipping">Shipping Info</Link></li>
          </ul>
        </div>

        <div className="footer__section">
          <h3>About Us</h3>
          <ul>
            <li><Link to="/about">Our Story</Link></li>
            <li><Link to="/careers">Careers</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
            <li><Link to="/terms">Terms of Service</Link></li>
          </ul>
        </div>

        <div className="footer__section">
          <h3>Connect With Us</h3>
          <div className="social__icons">
            <a href="#"><i className="fab fa-facebook"></i></a>
            <a href="#"><i className="fab fa-twitter"></i></a>
            <a href="#"><i className="fab fa-instagram"></i></a>
            <a href="#"><i className="fab fa-pinterest"></i></a>
          </div>
          <p>Subscribe to our newsletter</p>
          <form className="newsletter__form">
            <input type="email" placeholder="Your email" />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </div>

      <div className="footer__bottom">
        <p>&copy; {new Date().getFullYear()} Digi Pooja Samagri. All rights reserved. Designed and Developed by <a href='www.digiworq.com' style={{color: "white", textDecoration: "none"}} target='_blank'>DIGIWORQ</a></p>
      </div>
    </footer>
  );
};

export default Footer;