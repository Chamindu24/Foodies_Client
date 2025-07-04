import React, { useContext } from 'react';
import './Menubar.css';
import { assets } from '../../assets/assets';
import { Link } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContex';

const Menubar = () => {
      const { quantity} = useContext(StoreContext);
      const uniqueItemsInCart = Object.values(quantity).filter(qty => qty > 0).length;
  
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary shadow-sm">
      <div className="container">
        {/* Logo */}
        <Link to={`/`}><img src={assets.logo} alt="Logo" className="mx-4" height={40} width={40} />
        </Link>
        {/* Toggle button for small screens */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Collapsible Nav */}
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          {/* Left nav links */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link active" aria-current="page" to={ '/' }>
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to={ '/explore' }>
                Explore
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to={ '/contact' }>
                Contact Us
              </Link>
            </li>
          </ul>

          {/* Right section: cart and buttons */}
          <div className="d-flex align-items-center gap-4 menubar-right">
            <Link to={`/cart`}><div className="position-relative">
              <img src={assets.cart} alt="Cart" height={32} width={32} />
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning">
                {uniqueItemsInCart}
              </span>
            </div></Link>

            <button className="btn btn-outline-primary">Login</button>
            <button className="btn btn-outline-success">Register</button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Menubar;
