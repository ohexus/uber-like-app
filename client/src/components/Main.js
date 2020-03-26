import React, { useEffect, useState } from 'react';
import {Link} from 'react-router-dom';

export default function Main() {
    const [isAuthorized, setIsAuthorized] = useState(false);

    const handleLogout = async () => {
        localStorage.removeItem('jwt_token');
        setIsAuthorized(false);
    }
    
    useEffect(() => {
        const jwt_token = localStorage.getItem('jwt_token');
        setIsAuthorized(!!jwt_token);
    },[]);

    return (
        <div>
            <h1> Easy Breeze </h1>
            {isAuthorized
                ? (
                    <>
                        <button type="button" onClick={handleLogout}>LOGOUT</button>
                    </>
                ) : (
                    <>
                        <h2> Log In or Sign Up </h2>
                        
                        <div>
                            <Link to="/login"> login </Link>
                                
                            <Link to="/signup"> signup </Link>
                        </div>
                    </>
                )
            } 
        </div>
    );
}