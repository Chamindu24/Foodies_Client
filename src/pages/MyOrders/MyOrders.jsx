import React, { useContext, useEffect, useState } from 'react'
import { StoreContext } from '../../context/StoreContex';
import axios from 'axios';
import { assets } from '../../assets/assets';
import './MyOrders.css';

const MyOrders = () => {
  const { token } = useContext(StoreContext);
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:8081/api/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  return (
    <div className='container'>
      <div className='py-5 justify-content-center'>
        <div className='col-11 card'>
          <table className='table table-responsive'>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order, index) => (
                  <tr key={index}>
                    <td>
                      <img src={assets.delivery} alt='delivary' height={48} width={48} />
                    </td>
                    <td>
                      {order.orderedItems.map((item, i) => (
                        <span key={i}>
                          {item.name} x {item.quantity}
                          {i !== order.orderedItems.length - 1 ? ', ' : ''}
                        </span>
                      ))}
                    </td>
                    <td>LKR {order.amount.toFixed(2)}</td>
                    <td>Items: {order.orderedItems.length}</td>
                    <td className='fw-bold text-capitalize'>
                      &#x25cf;{' '}{order.orderStatus}
                    </td>
                    <td>
                      <button className='btn btn-warning btn-sm' onClick={fetchOrders}>
                        <i className='bi bi-arrow-clockwise'></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className='text-center'>
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyOrders;
