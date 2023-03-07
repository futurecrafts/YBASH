import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import axios from './axios';

export default function Login() {
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        setErrMsg('');
    }, [email, pass])

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(email);
        const params = new URLSearchParams();
        params.append('Email', email);
        params.append('Password', pass);
        try{
            const response = await axios.post('/api/login', params);
            console.log(response?.data);
            if (response.status === 200) {
                navigate('/api/dashboard');
            }
        } catch (err) {
            if (err.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(err.response.data);
                console.log(err.response.status);
            } else if (err.request) {
                // The request was made but no reponse was received
                console.log(err.request);
            } else {
                console.log('Registration Failed')
            }
            alert('Login was not successful! please check the console log!')
        }
    }
//<button className="link-btn" onClick={() => props.onFormSwitch('register')}>Don't have an account? Register here.</button>
    return (
        <div className="auth-form-container">
            <h2>Login</h2>
            <form className="login-form" onSubmit={handleSubmit}>
                <label htmlFor="email">email</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)}type="email" placeholder="youremail@gmail.com" id="email" name="email" />
                <label htmlFor="password">password</label>
                <input value={pass} onChange={(e) => setPass(e.target.value)} type="password" placeholder="********" id="password" name="password" />
                <button type="submit">Log In</button>
            </form>
            <button className="link-btn">
                <Link to="/api/register">Don't have an account? Register here.</Link>
            </button>
        </div>
    );
}