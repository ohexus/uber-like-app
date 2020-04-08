import React, { useState, useEffect, useContext } from 'react';
import { Redirect } from 'react-router-dom';
import './UserPage.scss';

import UserInfo from '../../components/UserInfo/UserInfo';
import TrucksPanel from '../../components/TrucksPanel/TrucksPanel';
import LoadsPanel from '../../components/LoadsPanel/LoadsPanel';
import OrderLoad from '../../components/OrderLoad/OrderLoad';
import WeatherPanel from '../../components/WeatherPanel/WeatherPanel';
import Map from '../../components/Map/Map';

import SocketContext from '../../context/SocketContext';

import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;
const USERINFO_API = `${API_URL}/api/user/userInfo`;

export default function UserPage() {
  const socket = useContext(SocketContext);

  const [user, setUser] = useState(null);
  const [ableUpdateProfile, setAbleUpdateProfile] = useState(true);

  const [routeRedirect, setRouteRedirect] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const resUser = await axios.get(USERINFO_API, {
        headers: {
          authorization: localStorage.getItem('jwt_token'),
        },
      }).then((res) => res.data);

      if (resUser.status !== 'OK') {
        localStorage.removeItem('jwt_token');
        setRouteRedirect(true);
        return null;
      }

      setUser(resUser.user);
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (user) {
      socket.on('ableUpdateProfile', (res) => {
        if (res.userId === user._id) setAbleUpdateProfile(res.isAble);
      });
    }
  }, [socket, user]);

  useEffect(() => {
    if (!localStorage.getItem('jwt_token')) setRouteRedirect(true);
  }, []);

  if (routeRedirect) {
    return <Redirect to="/" />;
  }

  return (<>
    { user && <div className="user">
      <Map user={ user } />

      <UserInfo user={ user } ableUpdateProfile={ ableUpdateProfile } />

      { user.role === 'driver'
        ? <TrucksPanel ableUpdateProfile={ ableUpdateProfile } />
        : <LoadsPanel />
      }

      { user.role === 'driver'
        && <OrderLoad />
      }

      <WeatherPanel />
    </div> }
  </>);
}
