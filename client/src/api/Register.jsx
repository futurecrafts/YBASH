import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import axios from './axios';

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,4}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

export default function Register() {
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [name, setName] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        setErrMsg('');
    }, [email, pass, name])

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(email);
         const v1 = USER_REGEX.test(name);
         const v2 = EMAIL_REGEX.test(email);
         const v3 = PWD_REGEX.test(pass);
        //  if (!v1 || !v2 || !v3) {
        //    setErrMsg("Invalid Entry!");
        //    console.log("Invalid Entry!");
        //    return;  
        //  }
        const params = new URLSearchParams();
        params.append('Username', name);
        params.append('Email', email);
        params.append('Password', pass);
        try{
            const response = await axios.post('/api/register', params);
            console.log(response?.data);
            console.log(response?.accessToken);
            console.log(JSON.stringify(response))

            navigate('/api/login');

        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 409) {
                setErrMsg('Username Taken');
            } else {
                setErrMsg('Registration Failed')
            }
        }
    }
//<button className="link-btn" onClick={() => props.onFormSwitch('login')}>Already have an account? Login here.</button>
    return (
        <div className="auth-form-container">
            <h2>Register</h2>
        <form className="register-form" onSubmit={handleSubmit}>
            <label htmlFor="name">Full name</label>
            <input value={name} name="name" onChange={(e) => setName(e.target.value)} id="name" placeholder="full Name" />
            <label htmlFor="email">email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)}type="email" placeholder="youremail@gmail.com" id="email" name="email" />
            <label htmlFor="password">password</label>
            <input value={pass} onChange={(e) => setPass(e.target.value)} type="password" placeholder="********" id="password" name="password" />
            <button type="submit">Sign Up</button>
        </form>
        <button className="link-btn">
            <Link to="/api/login">Already have an account? Login here.</Link>
        </button>
    </div>
    );
}
