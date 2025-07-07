import React, { useState } from 'react'
import './Register.css'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser } from '../../services/authService';
import { toast } from 'react-toastify';

const Register = () => {
    const navigate = useNavigate();
    const [data, setData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const onChangeHandler = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        });
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        try {
            const response = await registerUser(data);
            if (response.status === 201){
                toast.success("Registration successful! Please login.");
                navigate('/login');
            }else {
                toast.error("Registration failed. Please try again.");
            }
        }catch (error) {
            console.error("Registration error:", error);
            toast.error("An error occurred during registration. Please try again.");
        }
    }
  return (
    <div className="container register-container">
        <div className="row">
            <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
                <div className="card border-0 shadow rounded-3 my-5">
                <div className="card-body p-4 p-sm-5">
                    <h5 className="card-title text-center mb-5 fw-light fs-5">Sign Up</h5>
                    <form onSubmit={onSubmitHandler}>
                    <div className="form-floating mb-3">
                        <input type="text" 
                            className="form-control" 
                            id="floatinName" 
                            placeholder="Name"
                            name='name'
                            value={data.name}
                            onChange={onChangeHandler}
                            required
                            />
                        <label htmlFor="floatinName">Full Name</label>
                    </div>
                    <div className="form-floating mb-3">
                        <input type="email" 
                            className="form-control" 
                            id="floatingInput" 
                            placeholder="name@example.com"
                            name='email'
                            value={data.email}
                            onChange={onChangeHandler}
                            required
                            />
                        <label htmlFor="floatingInput">Email address</label>
                    </div>
                    <div className="form-floating mb-3">
                        <input type="password" 
                            className="form-control" 
                            id="floatingPassword" 
                            placeholder="Password"
                            name='password'
                            value={data.password}
                            onChange={onChangeHandler}
                            required
                            />
                        <label htmlFor="floatingPassword">Password</label>
                    </div>

                    
                    <div className="d-grid">
                        <button className="btn btn-outline-primary btn-login text-uppercase " type="submit">Sign
                        Up</button>
                    </div>
                    <div className='mt-4'>
                        Don't have an account? <Link to={`/login`}>Sign In</Link>
                    </div>
                    
                    </form>
                </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Register
