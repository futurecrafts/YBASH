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
            console.log(response?.accessToken);
            console.log(JSON.stringify(response))

            navigate('/api/dashboard');
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 409) {
                setErrMsg('Username Taken');
            } else {
                setErrMsg('Login Failed')
            }
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