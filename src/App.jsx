import React from 'react'
import Menubar from './components/Menubar/Menubar'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home'
import ContactUs from './pages/ContactUs/ContactUs'
import ExploreFood from './pages/ExploreFood/ExploreFood'
import FoodDetails from './pages/FoodDetails/FoodDetails'
import Cart from './pages/Cart/Cart'

const App = () => {
  return (
    <div>
      <Menubar />
      
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/explore" element={<ExploreFood/>} />
        <Route path="/contact" element={<ContactUs/>} />
        <Route path="/food/:id" element={<FoodDetails/>} />
        <Route path="/cart" element={<Cart/>} />
      </Routes>
    </div>
  )
}

export default App
