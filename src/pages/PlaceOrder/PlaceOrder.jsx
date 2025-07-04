import React, { useContext } from 'react';
import './placeOrder.css';
import { StoreContext } from '../../context/StoreContex';
import { calculateCartTotals } from '../../utils/cartUtils';

const PlaceOrder = () => {
   const {foodList, quantity,setQuantity }= useContext(StoreContext);
   const cardItems = foodList.filter(food => quantity[food.id] > 0);

    const {  shipping, tax, total } =  calculateCartTotals(cardItems, quantity);
    
  return (
    <div>
      <div className="container">
        
          <div className="mt-4 text-center">
            
            <h2>Checkout form</h2>
            
          </div>

          <div className="row g-5">
            <div className="col-md-5 col-lg-4 order-md-last">
              <h4 className="d-flex justify-content-between align-items-center mb-3">
                <span className="text-primary">Order Summary</span>
                <span className="badge bg-primary rounded-pill">{cardItems.length}</span>
              </h4>
              <ul className="list-group mb-3">
                {cardItems.map((food) => (
                    <li className="list-group-item d-flex justify-content-between lh-sm">
                        <div>
                            <h6 className="my-0">{food.name}</h6>
                            <small className="text-muted">Quantity: {quantity[food.id]}</small>
                        </div>
                        <span className="text-muted">Rs.{food.price}</span>
                    </li>
                ))}
                <li className="list-group-item d-flex justify-content-between ">
                  <span>Shipping</span>
                  <p>Rs.{shipping}</p>
                </li>
                <li className="list-group-item d-flex justify-content-between">
                  <span>Tax</span>
                  <p>Rs.{tax}</p>
                </li>
                
                
                <li className="list-group-item d-flex justify-content-between">
                  <span>Total </span>
                  <strong>Rs.{total}</strong>
                </li>
              </ul>

              
            </div>

            <div className="col-md-7 col-lg-8">
              <h4 className="mb-3">Billing address</h4>
              <form className="needs-validation" noValidate>
                <div className="row g-3">
                  <div className="col-sm-6">
                    <label htmlFor="firstName" className="form-label">First name</label>
                    <input type="text" className="form-control" id="firstName" placeholder="" required />
                    <div className="invalid-feedback">Valid first name is required.</div>
                  </div>

                  <div className="col-sm-6">
                    <label htmlFor="lastName" className="form-label">Last name</label>
                    <input type="text" className="form-control" id="lastName" placeholder="" required />
                    <div className="invalid-feedback">Valid last name is required.</div>
                  </div>

                  

                  <div className="col-12">
                    <label htmlFor="email" className="form-label">Email </label>
                    <input type="email" className="form-control" id="email" placeholder="you@example.com" />
                    <div className="invalid-feedback">Please enter a valid email address for shipping updates.</div>
                  </div>

                  

                  <div className="col-12">
                    <label htmlFor="Phone Number" className="form-label">Phone Number </label>
                    <input type="number" className="form-control" id="PhoneNumber" placeholder="+94 71234567" />
                  </div>

                  <div className="col-12">
                    <label htmlFor="address" className="form-label">Address</label>
                    <input type="text" className="form-control" id="address" placeholder="1234 Main St" required />
                    <div className="invalid-feedback">Please enter your shipping address.</div>
                  </div>

                  <div className="col-md-5">
                    <label htmlFor="country" className="form-label">Country</label>
                    <select className="form-select" id="country" required>
                      <option value="">Choose...</option>
                      <option>Sri Lnaka</option>
                    </select>
                    <div className="invalid-feedback">Please select a valid country.</div>
                  </div>

                  <div className="col-md-4">
                    <label htmlFor="state" className="form-label">State</label>
                    <select className="form-select" id="state" required>
                      <option value="">Choose...</option>
                      <option>Matara</option>
                    </select>
                    <div className="invalid-feedback">Please provide a valid state.</div>
                  </div>

                  <div className="col-md-3">
                    <label htmlFor="zip" className="form-label">Zip</label>
                    <input type="text" className="form-control" id="zip" placeholder="82400" required />
                    <div className="invalid-feedback">Zip code required.</div>
                  </div>
                </div>

                <hr className="my-4" />

                

                

               
                <button className="w-100 mb-4 btn btn-primary btn-lg" type="submit"
                    disabled={cardItems.length === 0}
                >Continue to checkout</button>
              </form>
            </div>
          </div>
        
        
      </div>
    </div>
  );
};

export default PlaceOrder;
