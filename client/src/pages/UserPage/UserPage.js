import React, { useState, useEffect } from 'react';
import './UserPage.scss';

import UserInfo from '../../components/UserInfo/UserInfo';
import TrucksPanel from '../../components/TrucksPanel/TrucksPanel';
import LoadsPanel from '../../components/LoadsPanel/LoadsPanel';
import OrderLoad from '../../components/OrderLoad/OrderLoad';
import WeatherPanel from '../../components/WeatherPanel/WeatherPanel';

import axios from 'axios';
import { Redirect } from 'react-router-dom';
import Map from '../../components/Map/Map';
const API_URL = process.env.REACT_APP_API_URL;
const USERINFO_API = `${API_URL}/api/user/userInfo`;

export default function UserPage() {
    const [user, setUser] = useState(null);
    
    const [routeRedirect, setRouteRedirect] = useState(false);

    const fetchUser = async() => {
        const user = await axios.get(USERINFO_API, {
            headers: {
                'authorization': localStorage.getItem('jwt_token')
            }
        });
    
        return user.data;
    }
    
    useEffect(() => {
        (async() => setUser(await fetchUser()))();
    }, []);
    
    useEffect(() => {
        if (!localStorage.getItem('jwt_token')) setRouteRedirect(true)
    }, []);

    if (routeRedirect) {
        return <Redirect to='/' />
    }

    return (
        <>
            {user && <div className='user'>
                <Map />

                <UserInfo user={user} />

                {user.role === 'driver' 
                    ? <TrucksPanel />
                    : <LoadsPanel />
                }

                {user.role === 'driver' &&
                    <OrderLoad />
                }

                <WeatherPanel />
            </div>}
        </>
    );
}