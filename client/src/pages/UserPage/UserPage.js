import React, { useState, useEffect } from 'react';
import './UserPage.scss';

import UserInfo from '../../components/UserInfo/UserInfo';
import TrucksPanel from '../../components/TrucksPanel/TrucksPanel';
import LoadsPanel from '../../components/LoadsPanel/LoadsPanel';
import OrderLoad from '../../components/OrderLoad/OrderLoad';
import WeatherPanel from '../../components/WeatherPanel/WeatherPanel';

import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;
const USERINFO_API = `${API_URL}/api/user/userInfo`;

export default function UserPage() {
    const [user, setUser] = useState(null);

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

    return (
        <>
            {user && <div className='user'>
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