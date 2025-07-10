import React, { useContext, useState } from 'react';
import './placeOrder.css';
import { StoreContext } from '../../context/StoreContex';
import { calculateCartTotals } from '../../utils/cartUtils';
import axios from 'axios';
import { toast } from 'react-toastify';
import { STRIPE_PUBLISHABLE_KEY } from '../../utils/constants'; 
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

// Separate component for the payment form
const CheckoutForm = ({ data, total, cardItems, quantity, onOrderComplete }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { token } = useContext(StoreContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handlePayment = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      toast.error("Stripe is not loaded yet. Please try again.");
      return;
    }

    setLoading(true);

    // Create order first
    const orderData = {
      userAddress: `${data.firstName} ${data.lastName}, ${data.address}, ${data.state}, ${data.country}, ${data.zip}`,
      phoneNumber: data.phoneNumber,
      email: data.email,
      orderedItems: cardItems.map(food => ({
        foodId: food.id,
        quantity: quantity[food.id],
        price: food.price * quantity[food.id],
        category: food.category,
        imageUrl: food.imageUrl,
        description: food.description,
        name: food.name
      })),
      amount: parseFloat(total.toFixed(2)),
      orderStatus: 'Preparing',
    };

    try {
      const response = await axios.post('http://localhost:8081/api/orders/create', orderData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 201 && response.data.clientSecret) {
        const cardElement = elements.getElement(CardElement);
        
        // Confirm payment with the card element
        const result = await stripe.confirmCardPayment(response.data.clientSecret, {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: `${data.firstName} ${data.lastName}`,
              email: data.email,
              phone: data.phoneNumber,
              address: {
                line1: data.address,
                state: data.state,
                country: data.country,
                postal_code: data.zip,
              }
            }
          }
        });

        if (result.error) {
          console.error('Payment failed:', result.error);
          toast.error(result.error.message);
          await deleteOrder(response.data.id);
        } else {
          console.log('Payment succeeded:', result.paymentIntent);
          toast.success("Payment successful!");
          await verifyPayment(result.paymentIntent.id);
          await clearCart();
          onOrderComplete();
          navigate('/myorders');
        }
      } else {
        toast.error("Failed to place order. Please try again.");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      if (error.response) {
        if (error.response.status === 403) {
          toast.error("Access denied. Please check your authentication.");
        } else if (error.response.status === 401) {
          toast.error("Session expired. Please log in again.");
          navigate('/login');
        } else {
          toast.error(`Server error: ${error.response.data.message || 'Please try again.'}`);
        }
      } else {
        toast.error("Network error. Please check your connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  const verifyPayment = async (paymentIntentId) => {
    try {
      await axios.post('http://localhost:8081/api/orders/verify', {
        payment_intent_id: paymentIntentId
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    } catch (error) {
      console.error("Error verifying payment:", error);
    }
  };

  const deleteOrder = async (orderId) => {
    try {
      await axios.delete(`http://localhost:8081/api/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log("Order deleted successfully");
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  const clearCart = async () => {
    try {
      await axios.delete('http://localhost:8081/api/cart', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }); 
      console.log("Cart cleared successfully");
    } catch (error) {
      console.error("Error clearing cart:", error);
      toast.error("Failed to clear cart. Please try again.");
    }
  };

  return (
    <form onSubmit={handlePayment}>
      <div className="mb-3">
        <label className="form-label">Card Details</label>
        <div className="form-control" style={{ padding: '10px' }}>
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </div>
      </div>
      
      <button 
        className="w-100 mb-4 btn btn-primary btn-lg" 
        type="submit"
        disabled={!stripe || loading}
      >
        {loading ? 'Processing...' : 'Complete Payment'}
      </button>
    </form>
  );
};

const PlaceOrder = () => {
  const { foodList, quantity, setQuantity } = useContext(StoreContext);
  const cardItems = foodList.filter(food => quantity[food.id] > 0);
  const { shipping, tax, total } = calculateCartTotals(cardItems, quantity);
  
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
  
  const [showPayment, setShowPayment] = useState(false);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    setShowPayment(true);
  };

  const onOrderComplete = () => {
    setQuantity({});
    setShowPayment(false);
    setData({
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      address: '',
      country: '',
      state: '',
      zip: ''
    });
  };

  return (
    <Elements stripe={stripePromise}>
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
                  <li key={food.id} className="list-group-item d-flex justify-content-between lh-sm">
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
              {!showPayment ? (
                <>
                  <h4 className="mb-3">Billing address</h4>
                  <form className="needs-validation" onSubmit={onSubmitHandler}>
                    <div className="row g-3">
                      <div className="col-sm-6">
                        <label htmlFor="firstName" className="form-label">First name</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          id="firstName" 
                          placeholder="" 
                          name="firstName"
                          value={data.firstName}
                          onChange={onChangeHandler}
                          required 
                        />
                      </div>

                      <div className="col-sm-6">
                        <label htmlFor="lastName" className="form-label">Last name</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          id="lastName" 
                          placeholder=""
                          required
                          name="lastName"
                          value={data.lastName}
                          onChange={onChangeHandler}
                        />
                      </div>

                      <div className="col-12">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input 
                          type="email" 
                          className="form-control" 
                          id="email" 
                          placeholder="you@example.com" 
                          required
                          name="email"
                          value={data.email}
                          onChange={onChangeHandler}
                        />
                      </div>

                      <div className="col-12">
                        <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
                        <input 
                          type="tel" 
                          className="form-control" 
                          id="phoneNumber" 
                          placeholder="+94 71234567" 
                          required
                          name="phoneNumber"
                          value={data.phoneNumber}
                          onChange={onChangeHandler}
                        />
                      </div>

                      <div className="col-12">
                        <label htmlFor="address" className="form-label">Address</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          id="address" 
                          placeholder="1234 Main St" 
                          required 
                          name="address"
                          value={data.address}
                          onChange={onChangeHandler}
                        />
                      </div>

                      <div className="col-md-5">
                        <label htmlFor="country" className="form-label">Country</label>
                        <select 
                          className="form-select" 
                          id="country" 
                          required
                          name="country"
                          value={data.country}
                          onChange={onChangeHandler}
                        >
                          <option value="">Choose...</option>
                          <option value="LK">Sri Lanka</option>
                        </select>
                      </div>

                      <div className="col-md-4">
                        <label htmlFor="state" className="form-label">State</label>
                        <select 
                          className="form-select" 
                          id="state" 
                          required
                          name="state"
                          value={data.state}
                          onChange={onChangeHandler}
                        >
                          <option value="">Choose...</option>
                          <option value="Matara">Matara</option>
                        </select>
                      </div>

                      <div className="col-md-3">
                        <label htmlFor="zip" className="form-label">Zip</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          id="zip" 
                          placeholder="82400" 
                          required 
                          name="zip"
                          value={data.zip}
                          onChange={onChangeHandler}
                        />
                      </div>
                    </div>

                    <hr className="my-4" />

                    <button 
                      className="w-100 mb-4 btn btn-primary btn-lg" 
                      type="submit"
                      disabled={cardItems.length === 0}
                    >
                      Continue to Payment
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <h4 className="mb-3">Payment Details</h4>
                  <CheckoutForm 
                    data={data}
                    total={total}
                    cardItems={cardItems}
                    quantity={quantity}
                    onOrderComplete={onOrderComplete}
                  />
                  <button 
                    className="btn btn-secondary mb-3"
                    onClick={() => setShowPayment(false)}
                  >
                    ← Back to Address
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Elements>
  );
};

export default PlaceOrder;