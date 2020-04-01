import React, { useEffect, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';

export default function MainPage() {
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [routeRedirect, setRouteRedirect] = useState(false);
    
    useEffect(() => {
        const jwt_token = localStorage.getItem('jwt_token');
        setIsAuthorized(!!jwt_token);
    }, []);
    
    useEffect(() => {
        if (isAuthorized) {
            setRouteRedirect(true);
        }
    }, [isAuthorized]);

    if(routeRedirect){
        return <Redirect to='/user' />
    }
    
    return (
        <>
            {!isAuthorized && (
                <div>
                    <h2> Log In or Sign Up </h2>
                        
                    <div>
                        <Link to="/login"> login </Link>
                                
                        <Link to="/signup"> signup </Link>
                    </div>
                </div>
            )} 
        </>
    );
}