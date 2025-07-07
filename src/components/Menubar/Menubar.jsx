import React, { useContext, useState } from 'react';
import './Menubar.css';
import { assets } from '../../assets/assets';
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContex';

const Menubar = () => {
  const [active, setActive] = useState('home');
      const { quantity,token,setToken,setQuantity} = useContext(StoreContext);
      const uniqueItemsInCart = Object.values(quantity).filter(qty => qty > 0).length;
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem('token');
    setToken("");
    setQuantity({});
    navigate('/');
  };
  
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
              <Link className={active=== 'home'? "nav-link fw-bold active": "nav-link"} aria-current="page" to={ '/' } onClick={() => setActive('home')}>
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className={active=== 'explore'? "nav-link fw-bold active": "nav-link"} to={ '/explore' } onClick={() => setActive('explore')}>
                Explore
              </Link>
            </li>
            <li className="nav-item">
              <Link className={active=== 'contact'? "nav-link fw-bold active": "nav-link"} to={ '/contact' } onClick={() => setActive('contact')}>
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

            {
              !token? (
                <>
                  <button className="btn btn-outline-primary" onClick={()=>navigate(`/login`)}>Login</button>
                  <button className="btn btn-outline-success" onClick={()=>navigate(`/register`)}>Register</button>
                </>
              ):(
                <div className='dropdown text-end'>
                    <a href="" className='d-block link-body-emphasis text-decoration-none dropdown-toggle'  data-bs-toggle='dropdown' aria-expanded='false'>
                      <img src={assets.avatar} alt="Avatar" className='rounded-circle' height={32} width={32} />
                    </a>
                    <ul className='dropdown-menu text-small cursor-pointer'>
                        <li className='dropdown-item' onClick={()=>navigate(`/myorders`)}>My Orders</li>
                        <li className='dropdown-item' onClick={logout}>Logout</li>
                    </ul>
                </div>
              )
            }
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Menubar;
