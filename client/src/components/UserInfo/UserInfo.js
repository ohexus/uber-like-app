import React, { useState, useContext, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import './UserInfo.scss';

import InfoTile from '../InfoTile/InfoTile';
import NotificationTile from '../NotificationTile/NotificationTile';
import UserUpdateForm from './UserUpdateForm/UserUpdateForm';
import PasswordUpdateForm from './PasswordUpdateForm/PasswordUpdateForm';
import UserAvatar from './UserAvatar/UserAvatar';

import SocketContext from '../../context/SocketContext';

import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;
const DELETEUSER_API = `${API_URL}/api/user/delete`;

export default function UserInfo(props) {
  const socket = useContext(SocketContext);

  const [user, setUser] = useState(props.user);
  const [undecodedAvatarImg, setUndecodedAvatarImg] = useState(props.user.avatarImg);

  const [showUserUpdateForm, setShowUserUpdateForm] = useState(false);
  const [showPasswordUpdateForm, setShowPasswordUpdateForm] = useState(false);

  const [NotificationMessage, setNotificationMessage] = useState(false);
  const [showUpdatedNotification, setShowUpdatedNotification] = useState(false);

  const [ableUpdateProfile] = useState(props.ableUpdateProfile);

  const [routeRedirect, setRouteRedirect] = useState(false);

  const toggleShowUserUpdateForm = () => {
    setShowUserUpdateForm(!showUserUpdateForm);
    setShowPasswordUpdateForm(false);
  };

  const toggleShowPasswordUpdateForm = () => {
    setShowPasswordUpdateForm(!showPasswordUpdateForm);
    setShowUserUpdateForm(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('jwt_token');
    setRouteRedirect(true);
  };

  const handleCloseUpdateForm = (message) => {
    setShowUserUpdateForm(false);
    setShowPasswordUpdateForm(false);

    setNotificationMessage(message);
    setShowUpdatedNotification(true);
  };

  const deleteAccount = async () => {
    await axios.delete(DELETEUSER_API, {
      headers: {
        authorization: localStorage.getItem('jwt_token'),
      },
    });

    handleLogout();
  };

  useEffect(() => {
    socket.on('updateUser', (updatedUser) =>
      setUser(updatedUser));

    socket.on('updateAvatar', (updatedUser) =>
      setUndecodedAvatarImg(updatedUser.avatarImg));
  }, [socket, user]);

  if (routeRedirect) {
    return <Redirect to="/" />;
  }

  return (
    <div className="user__profile">
      <h1 className="user__role"> { user.role.toUpperCase() } </h1>

      <UserAvatar undecodedImg={ undecodedAvatarImg } />

      <div className="user__info">
        <h2> Info: </h2>

        { showUpdatedNotification && <NotificationTile
          info={ NotificationMessage }
          closeNotification={ () => setShowUpdatedNotification(false) }
        /> }

        <InfoTile
          label={ 'Username:' }
          info={ user.username }
        />

        <InfoTile
          label={ 'First Name:' }
          info={ user.firstName }
        />

        <InfoTile
          label={ 'Last Name:' }
          info={ user.lastName }
        />

        <InfoTile
          label={ 'Email:' }
          info={ user.email }
        />

        <InfoTile
          label={ 'Mobile number:' }
          info={ user.mobileNumber }
        />

        <div className="user__panel">
          { ableUpdateProfile && <button type="button" onClick={ toggleShowUserUpdateForm }>
            { showUserUpdateForm
              ? 'Close update User Info'
              : 'Update User Info'
            }
          </button> }

          { showUserUpdateForm && <UserUpdateForm
            user={ user }
            className='user__updateuser'
            closeForm={ () => handleCloseUpdateForm('User info updated') }
          /> }

          { ableUpdateProfile && <button type="button" onClick={ toggleShowPasswordUpdateForm }>
            { showPasswordUpdateForm
              ? 'Close update Password Info'
              : 'Update Password Info'
            }
          </button> }

          { showPasswordUpdateForm && <PasswordUpdateForm
            password={ user.password }
            className='user__updatepassword'
            closeForm={ () => handleCloseUpdateForm('Password updated') }
          /> }

          <button type="button" onClick={ handleLogout }> Log out </button>

          { ableUpdateProfile && user.role === 'shipper'
            && <button type="button" onClick={ deleteAccount }> Delete Account </button>
          }
        </div>
      </div>
    </div>
  );
}
