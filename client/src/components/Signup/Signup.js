import React, { useState, useEffect } from 'react';
import { Redirect, Link } from 'react-router-dom';
import axios from 'axios';
const API_URL = 'http://localhost:8081';
const SIGNUP_API = `${API_URL}/api/auth/signup`;

export default function Signup() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [routeRedirect, setRouteRedirect] = useState(false);
    
    const fetchSignup = async (e) => {
        e.preventDefault();
        await axios.post(SIGNUP_API, { firstName, lastName, username, email, phone, password, role });
        alert('Signed up successfully!');
        setRouteRedirect(true);
    }
    
    const handleFirstNameInput = (e) => {
        setFirstName(e.target.value);
    }
    
    const handleLastNameInput = (e) => {
        setLastName(e.target.value);
    }

    const handleUsernameInput = (e) => {
        setUsername(e.target.value);
    }

    const handleEmailInput = (e) => {
        setEmail(e.target.value);
    }

    const handlePhoneInput = (e) => {
        setPhone(e.target.value);
    }

    const handlePasswordInput = (e) => {
        setPassword(e.target.value);
    }

    const handleRadioShipper = (e) => {
        setRole(e.target.value);
    }

    const handleRadioDriver = (e) => {
        setRole(e.target.value);
    }

    useEffect(() => {
        const jwt_token = localStorage.getItem('jwt_token');
        setRouteRedirect(!!jwt_token);
    },[]);

    if(routeRedirect){
        return <Redirect to='/' />
    }

    return (
        <div>
            <h1> Sign Up: </h1>
            <form onSubmit={fetchSignup}>
                <span> First Name: </span>
                <input 
                    type='text'
                    name='firstName'
                    value={firstName}
                    onChange={handleFirstNameInput}
                    required 
                />
                <hr/>
                
                <span> Last Name: </span>
                <input 
                    type='text'
                    name='lastName'
                    value={lastName}
                    onChange={handleLastNameInput}
                    required 
                />
                <hr/>

                <span> Username: </span>
                <input 
                    type='text'
                    name='username'
                    value={username}
                    onChange={handleUsernameInput}
                    required
                />
                <hr/>

                <span> Email: </span>
                <input 
                    type='email'
                    name='email'
                    value={email}
                    onChange={handleEmailInput}
                    required
                />
                <hr/>

                <span> Phone Number: </span>
                <input 
                    type='text'
                    name='phone'
                    value={phone}
                    onChange={handlePhoneInput}
                    required
                />
                <hr/>

                <span> Password: </span>
                <input 
                    type='password'
                    name='password'
                    value={password}
                    onChange={handlePasswordInput}
                    required
                />
                <hr/>

                <h4> You are: </h4>
                <input type="radio" id="driver" name="role" value="driver" onChange={handleRadioDriver}/>
                <label htmlFor="driver"> Driver </label>
                
                <input type="radio" id="shipper" name="role" value="shipper" onChange={handleRadioShipper} />
                <label htmlFor="shipper"> Shipper </label>

                <button type="submit"> Sign Up </button>

                <Link to="/login"> Login </Link>

                <Link to="/"> Home Page </Link>
            </form>
        </div>
    );
}