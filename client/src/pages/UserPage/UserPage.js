import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import './UserPage.scss';

import UserInfo from '../../components/UserInfo/UserInfo';
import TrucksPanel from '../../components/TrucksPanel/TrucksPanel';
import LoadsPanel from '../../components/LoadsPanel/LoadsPanel';
import OrderLoad from '../../components/OrderLoad/OrderLoad';
import WeatherPanel from '../../components/WeatherPanel/WeatherPanel';
import Map from '../../components/Map/Map';

import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;
const USERINFO_API = `${API_URL}/api/user/userInfo`;

export default function UserPage() {
  const [user, setUser] = useState(null);

  const [routeRedirect, setRouteRedirect] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await axios.get(USERINFO_API, {
        headers: {
          authorization: localStorage.getItem('jwt_token'),
        },
      }).then((res) => res.data);

      if (user === 'User not found') {
        localStorage.removeItem('jwt_token');
        setRouteRedirect(true);
        return null;
      }

      setUser(user);
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (!localStorage.getItem('jwt_token')) setRouteRedirect(true);
  }, []);

  if (routeRedirect) {
    return <Redirect to="/" />;
  }

  return (
    <>
      { user && <div className="user">
        <Map user={ user } />

        <UserInfo user={ user } />

        { user.role === 'driver'
          ? <TrucksPanel />
          : <LoadsPanel />
        }

        { user.role === 'driver'
          && <OrderLoad />
        }

        <WeatherPanel />
      </div> }
    </>
  );
}
