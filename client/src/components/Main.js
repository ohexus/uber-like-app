import React, { useEffect, useState } from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
const API_URL = 'http://localhost:8081';
const USERINFO_API = `${API_URL}/api/user/userinfo`;

export default function Main() {
    const [isAuthorized, setIsAuthorized] = useState(false);

    const handleLogout = async () => {
        localStorage.removeItem('jwt_token');
        setIsAuthorized(false);
    }
    
    useEffect(() => {
        const jwt_token = localStorage.getItem('jwt_token');
        setIsAuthorized(!!jwt_token);
    }, []);
    
    useEffect(() => {
        if (isAuthorized) {
            (async function fetchUser() {
                const user = await axios.get(USERINFO_API, {
                    headers: {
                        'authorization': localStorage.getItem('jwt_token')
                    }
                });

                (user.data.role === 'driver')
                ? console.log('driver')
                : console.log('shipper')
            })();
        }
    }, [isAuthorized]);
    
    return (
        <div>
            <h1> Easy Breeze </h1>
            {!isAuthorized && (
                <div>
                    <h2> Log In or Sign Up </h2>
                        
                    <div>
                        <Link to="/login"> login </Link>
                                
                        <Link to="/signup"> signup </Link>
                    </div>
                </div>
            )} 
        </div>
    );
}