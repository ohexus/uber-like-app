import React, { useState, useEffect } from 'react';
import './UserPage.scss';
import UserInfo from '../../components/UserInfo/UserInfo';

import axios from 'axios';
import TrucksPanel from '../../components/TrucksPanel/TrucksPanel';
const API_URL = 'http://localhost:8081';
const USERINFO_API = `${API_URL}/api/user/userinfo`;

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

                {user.role === 'driver' && <>
                    <TrucksPanel />
                </>}
            </div>}
        </>
    );
}