import React, { useState, useEffect } from 'react';
import { Redirect, Link } from 'react-router-dom';

import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;
const LOGIN_API = `${API_URL}/api/auth/login`;

export default function Login() {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [routeRedirect, setRouteRedirect] = useState(false);
    
    const fetchLogin = async (e) => {
        e.preventDefault();
        const jwt_token = await axios.post(LOGIN_API, { login, password });
        localStorage.setItem('jwt_token', jwt_token.data);
        setRouteRedirect(true);
    }

    useEffect(() => {
        const jwt_token = localStorage.getItem('jwt_token');
        setRouteRedirect(!!jwt_token);
    }, []);

    const handleLoginInput = (e) => {
        setLogin(e.target.value);
    }

    const handlePasswordInput = (e) => {
        setPassword(e.target.value);
    }

    if(routeRedirect){
        return <Redirect to='/' />
    }

    return (
        <div>
            <h1> LOGIN: </h1>
            <form onSubmit={fetchLogin}>
                <div>
                    <label htmlFor='login'> Email or Username: </label>
                    <input 
                        type='text'
                        name='login'
                        value={login}
                        onChange={handleLoginInput}
                        required
                    />
                </div>

                <div>
                    <label htmlFor='password'> Password: </label>
                    <input 
                        type='password'
                        name='password'
                        value={password}
                        onChange={handlePasswordInput}
                        required
                    />
                </div>
                    
                <button type="submit"> Login </button><br/>
                
                <Link to="/signup"> Sign up </Link>

                <Link to="/"> Home Page </Link>
            </form>
        </div>
    );
}