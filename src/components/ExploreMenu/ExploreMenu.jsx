import React from 'react'
import { categories } from '../../assets/assets'
import './ExploreMenu.css'

const ExploreMenu = () => {
  return (
    <div className='explore-menu position-relative'>
      <h1 className='d-flex justify-content-between align-items-center '>
        Explore Our Menu
        <div className='d-flex'>
            <i className='bi bi-arrow-left-circle scroll-icon'></i>
            <i className='bi bi-arrow-right-circle scroll-icon'></i>
        </div>

      </h1>
      <p>Explore curated lists of dishes from top categories </p>
      <div className='explore-menu-list d-flex  gap-4 justify-content-between overflow-auto'>
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
    </div>
  )
}

export default ExploreMenu
