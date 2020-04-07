import React, { useState } from 'react';
import { Redirect, Link } from 'react-router-dom';

import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;
const CHECKUSER_API = `${API_URL}/api/recoverPassword/checkUser`;
const RECOVERPASSWORD_API = `${API_URL}/api/recoverPassword/recover`;

export default function PasswordRecoveryPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [checkNewPassword, setCheckNewPassword] = useState('');

  const [warningMessage, setWarningMessage] = useState('');
  const [showWarning, setShowWarning] = useState(false);

  const [routeRedirect, setRouteRedirect] = useState(false);

  const recoverPassword = async (userId) => {
    await axios.put(RECOVERPASSWORD_API, {
      userId,
      newPassword,
    });
  };

  const checkUser = async () => {
    const user = await axios.post(CHECKUSER_API, {
      username,
      email,
      firstName,
      lastName,
      mobileNumber,
    });

    return user.data;
  };

  const checkRecoverPassword = async (e) => {
    e.preventDefault();

    const userChecked = await checkUser();

    if (userChecked.status === 'OK') {
      if (newPassword === checkNewPassword) {
        recoverPassword(userChecked.user._id);
        alert('Password has been changed');
        setRouteRedirect(true);
      } else {
        return handleAlert('Passwords does not match!');
      }
    } else {
      return handleAlert('Such user not found, please check filled information!');
    }
  };

  const handleAlert = (message) => {
    setWarningMessage(message);
    setShowWarning(true);
  };

  const handleUsernameInput = (e) => {
    setUsername(e.target.value);
  };

  const handleEmailInput = (e) => {
    setEmail(e.target.value);
  };

  const handleFirstNameInput = (e) => {
    setFirstName(e.target.value);
  };

  const handleLastNameInput = (e) => {
    setLastName(e.target.value);
  };

  const handleMobileNumberInput = (e) => {
    setMobileNumber(e.target.value);
  };

  const handleNewPasswordInput = (e) => {
    setNewPassword(e.target.value);
  };

  const handleCheckNewPasswordInput = (e) => {
    setCheckNewPassword(e.target.value);
  };

  if (routeRedirect) {
    return <Redirect to="/" />;
  }

  return (
    <form className="recoverypassword" onSubmit={ checkRecoverPassword }>
      <h1> Password Recovery: </h1>

      <p> To change password please enter your info and new password </p>

      { showWarning && <h3>{ warningMessage }</h3> }

      <label htmlFor="username"> Username: </label>
      <input
        type="text"
        name="username"
        value={ username }
        minLength="3"
        onChange={ handleUsernameInput }
        required
      />
      <hr />

      <label htmlFor="email"> Email: </label>
      <input
        type="text"
        name="email"
        value={ email }
        onChange={ handleEmailInput }
        required
      />
      <hr />

      <label htmlFor="firstName"> First Name: </label>
      <input
        type="text"
        name="firstName"
        value={ firstName }
        minLength="3"
        onChange={ handleFirstNameInput }
        required
      />
      <hr />

      <label htmlFor="lastName"> Last Name: </label>
      <input
        type="text"
        name="lastName"
        value={ lastName }
        minLength="3"
        onChange={ handleLastNameInput }
        required
      />
      <hr />

      <label htmlFor="mobileNumber"> Mobile Number: </label>
      <input
        type="number"
        name="mobileNumber"
        value={ mobileNumber }
        min="0"
        onChange={ handleMobileNumberInput }
        required
      />
      <hr />

      <label htmlFor="newPassword"> New password: </label>
      <input
        type="password"
        name="newPassword"
        value={ newPassword }
        minLength="3"
        onChange={ handleNewPasswordInput }
        required
      />
      <hr />

      <label htmlFor="checkNewPassword"> Repeat new password: </label>
      <input
        type="password"
        name="checkNewPassword"
        value={ checkNewPassword }
        minLength="3"
        onChange={ handleCheckNewPasswordInput }
        required
      />
      <hr />

      <button type="submit"> Submit password recovery </button>

      <hr />

      <div className="navigation-panel">
        <Link to="/login"> Login </Link>

        <Link to="/signup"> Sign up </Link>

        <Link to="/"> Home Page </Link>
      </div>
    </form>
  );
}
