import React, { useRef } from 'react'
import { categories } from '../../assets/assets'
import './ExploreMenu.css'

const ExploreMenu = () => {
  const menuRef= useRef(null);
  const scrollLeft = () => {
    if (menuRef.current) {
      menuRef.current.scrollBy({
        left: -200,
        behavior: 'smooth'
      });
    }
  }
  const scrollRight = () => {
    if (menuRef.current) {
      menuRef.current.scrollBy({
        left: 200,
        behavior: 'smooth'
      });
    }
  }
  return (
    <div className='explore-menu position-relative'>
      <h1 className='d-flex justify-content-between align-items-center '>
        Explore Our Menu
        <div className='d-flex'>
            <i className='bi bi-arrow-left-circle scroll-icon' onClick={scrollLeft} ></i>
            <i className='bi bi-arrow-right-circle scroll-icon' onClick={scrollRight} ></i>
        </div>

      </h1>
      <p>Explore curated lists of dishes from top categories </p>
      <div className='explore-menu-list d-flex  gap-4 justify-content-between overflow-auto' ref={menuRef}>
        {
            categories.map((item, index) => {
                return (
                    <div key={index} className='explore-menu-list-item text-center'>
                        <img src={item.icon} alt="" className='rounded-circle' height={128} width={128} />
                        <p className='mt-2 fw-bold '>{item.category}</p>

                    </div>
                )
            })
        }

      </div>
      <hr />
    </div>
  )
}

export default ExploreMenu
