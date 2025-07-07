import React, { useContext, useState } from 'react'
import './Login.css'
import { Link, useNavigate } from 'react-router-dom'
import { loginUser } from '../../services/authService';
import { toast } from 'react-toastify';
import { StoreContext } from '../../context/StoreContex';

const Login = () => {
    const navigate = useNavigate();
    const {setToken} = useContext(StoreContext)
    const [data, setData] = useState({
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
            const response = await loginUser(data);
            if (response.status === 200){
                setToken(response.data.token);
                localStorage.setItem('token', response.data.token);
                toast.success("Login successful!");
                navigate('/');
            }else {
                toast.error("Login failed. Please check your credentials.");
            }
        }catch (error) {
            console.error("Login error:", error);
            toast.error("An error occurred during login. Please try again.");
        }
    }

  return (
    <div className="container login-container">
        <div className="row">
        <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
            <div className="card border-0 shadow rounded-3 my-5">
            <div className="card-body p-4 p-sm-5">
                <h5 className="card-title text-center mb-5 fw-light fs-5">Sign In</h5>
                <form onSubmit={onSubmitHandler}>
                <div className="form-floating mb-3">
                    <input type="email" 
                    className="form-control" 
                    id="floatingInput" 
                    placeholder="name@example.com"
                    name='email'
                    value={data.email}
                    onChange={onChangeHandler}
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
                    />
                    <label htmlFor="floatingPassword">Password</label>
                </div>

                
                <div className="d-grid">
                    <button className="btn btn-outline-primary btn-login text-uppercase " 
                    type="submit">
                        Sign in</button>
                </div>
                <div className='mt-4'>
                    Already have an account? <Link to={`/register`}>Sign Up</Link>
                </div>
                
                </form>
            </div>
            </div>
        </div>
        </div>
    </div>
  )
}

export default Login
