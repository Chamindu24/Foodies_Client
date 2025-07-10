import React, { useContext, useState } from 'react';
import './placeOrder.css';
import { StoreContext } from '../../context/StoreContex';
import { calculateCartTotals } from '../../utils/cartUtils';
import axios from 'axios';
import { toast } from 'react-toastify';
import { RAZORPAY_KEY } from '../../utils/constants';
import { useNavigate } from 'react-router-dom';

const PlaceOrder = () => {
    const {foodList, quantity,setQuantity, token }= useContext(StoreContext);
    const cardItems = foodList.filter(food => quantity[food.id] > 0);

    const {  shipping, tax, total } =  calculateCartTotals(cardItems, quantity);
    const [data, setData] = useState({
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      address: '',
      country: '',
      state: '',
      zip: ''
    });
    const onChangeHandler = (e) => {
      const { name, value } = e.target;
      setData({ ...data, [name]: value });
    };
    const navigate = useNavigate();

    const onSubmitHandler = async(e) => {
      e.preventDefault();
      const orderData = {
        userAddress: `${data.firstName} ${data.lastName}, ${data.address}, ${data.state}, ${data.country}, ${data.zip}`,
        phoneNumber: data.phoneNumber,
        email: data.email,
        orderedItems : cardItems.map(food => ({
          foodId: food.id,
          quantity: quantity[food.id],
          price: food.price * quantity[food.id],
          category: food.category,
          imageUrl : food.imageUrl,
          description : food.description,
          name: food.name
        })),
        amount: total.toFixed(2),
        orderStatus: 'Preparing',
      }
      try{
        const response = await axios.post('http://localhost:8081/api/orders/create', orderData, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.status === 201 && response.data.razorpayOrderId ){
          //initialize Razorpay payment
          initiateRazorpayPayment(response.data);
        } else {
          toast.error("Failed to place order. Please try again.");
        }

      }catch (error) {
        console.error("Error placing order:", error);
        toast.error("Failed to place order. Please try again.");
      }
      
    };    

  const initiateRazorpayPayment = (orderData) => {
    const options = {
      key: RAZORPAY_KEY, // Replace with your Razorpay key
      amount: orderData.amount , // Amount in paise
      currency: "LKR",
      name: "Foodies",
      description: "Order Payment",
      order_id: orderData.razorpayOrderId,
      handler: async function (razorpayResponse) {
        await verifyPayment(razorpayResponse);
        toast.success("Payment successful!");
      },
      prefill: {
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        contact: data.phoneNumber,
      },
      theme: {
        color: "#3399cc"
      },
      modal: {
        ondismiss: async function() {
          toast.error("Payment cancelled by user.");
          await deleteOrder(orderData.id); 
        }
      }
    };
    const razorpay = new window.Razorpay(options);
    razorpay.open();
  }

  const verifyPayment = async (razorpayResponse) => {
    try {
      const response = await axios.post('http://localhost:8081/api/orders/verify', {
        razorpayPaymentId: razorpayResponse.razorpay_payment_id,
        razorpayOrderId: razorpayResponse.razorpay_order_id,  
        razorpaySignature: razorpayResponse.razorpay_signature,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.status === 200) {
        toast.success("Payment verified successfully!");
        await clearCart();
        navigate('/myorders');
      } else {
        toast.error("Payment verification failed. Please try again.");
        navigate('/');
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
      toast.error("Payment verification failed. Please try again.");
    }
  }

  const deleteOrder = async (orderId) => {
    try {
      await axios.delete(`http://localhost:8081/api/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log("Order deleted successfully");
      toast.success("Order deleted successfully.");
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("Failed to delete order. Please try again.");
    
    }
  }

  const clearCart = async () => {
    try {
      await axios.delete('http://localhost:8081/api/cart', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }); 
      setQuantity({});
      console.log("Cart cleared successfully");
    } catch (error) {
      console.error("Error clearing cart:", error);
      toast.error("Failed to clear cart. Please try again.");
    }
  }

  
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
                  <p>Rs.{tax.toFixed(2)}</p>
                </li>
                
                
                <li className="list-group-item d-flex justify-content-between">
                  <span>Total </span>
                  <strong>Rs.{total}</strong>
                </li>
              </ul>

              
            </div>

            <div className="col-md-7 col-lg-8">
              <h4 className="mb-3">Billing address</h4>
              <form className="needs-validation" onSubmit={onSubmitHandler} >
                <div className="row g-3">
                  <div className="col-sm-6">
                    <label htmlFor="firstName" className="form-label">First name</label>
                    <input type="text" 
                      className="form-control" 
                      id="firstName" placeholder="" 
                      name="firstName"
                      value={data.firstName}
                      onChange={onChangeHandler}
                      required 
                      />
                    <div className="invalid-feedback">Valid first name is required.</div>
                  </div>

                  <div className="col-sm-6">
                    <label htmlFor="lastName" className="form-label">Last name</label>
                    <input type="text" 
                      className="form-control" 
                      id="lastName" 
                      placeholder=""
                       required
                       name="lastName"
                       value={data.lastName}
                       onChange={onChangeHandler}
                    />
                    <div className="invalid-feedback">Valid last name is required.</div>
                  </div>

                  

                  <div className="col-12">
                    <label htmlFor="email" className="form-label">Email </label>
                    <input type="email" 
                    className="form-control" 
                    id="email" 
                    placeholder="you@example.com" 
                    required
                    name="email"
                    value={data.email}
                    onChange={onChangeHandler}
                    />
                    <div className="invalid-feedback">Please enter a valid email address for shipping updates.</div>
                  </div>

                  

                  <div className="col-12">
                    <label htmlFor="Phone Number" className="form-label">Phone Number </label>
                    <input type="number" 
                      className="form-control" 
                      id="PhoneNumber" 
                      placeholder="+94 71234567" 
                      required
                      name="phoneNumber"
                      value={data.phoneNumber}
                      onChange={onChangeHandler}
                    />
                  </div>

                  <div className="col-12">
                    <label htmlFor="address" className="form-label">Address</label>
                    <input type="text" 
                      className="form-control" 
                      id="address" 
                      placeholder="1234 Main St" 
                      required 
                      name="address"
                      value={data.address}
                      onChange={onChangeHandler}
                    />
                    <div className="invalid-feedback">Please enter your shipping address.</div>
                  </div>

                  <div className="col-md-5">
                    <label htmlFor="country" className="form-label">Country</label>
                    <select className="form-select" 
                    id="country" 
                    required
                    name="country"
                    value={data.country}
                    onChange={onChangeHandler}
                    >
                      <option value="">Choose...</option>
                      <option>Sri Lnaka</option>
                    </select>
                    <div className="invalid-feedback">Please select a valid country.</div>
                  </div>

                  <div className="col-md-4">
                    <label htmlFor="state" className="form-label">State</label>
                    <select className="form-select" 
                      id="state" 
                      required
                      name="state"
                      value={data.state}
                      onChange={onChangeHandler}
                    >
                      <option value="">Choose...</option>
                      <option>Matara</option>
                    </select>
                    <div className="invalid-feedback">Please provide a valid state.</div>
                  </div>

                  <div className="col-md-3">
                    <label htmlFor="zip" className="form-label">Zip</label>
                    <input type="text" 
                      className="form-control" 
                      id="zip" 
                      placeholder="82400" 
                      required 
                      name="zip"
                      value={data.zip}
                      onChange={onChangeHandler}
                    />
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
