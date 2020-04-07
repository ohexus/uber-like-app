import React, { useState, useEffect } from 'react';
import { Redirect, Link } from 'react-router-dom';

import checkBeforePostToServer from '../../helpers/checkBeforePostToServer';

import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;
const SIGNUP_API = `${API_URL}/api/auth/signup`;

export default function SignupPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(null);

  const [routeRedirect, setRouteRedirect] = useState(false);

  const [warningMessage, setWarningMessage] = useState('');
  const [showWarning, setShowWarning] = useState(false);

  const fetchSignup = async (e) => {
    e.preventDefault();

    const isValid = checkBeforePostToServer([firstName, lastName, username, email, mobileNumber, password]);

    if (isValid && role !== null) {
      const status = await axios.post(SIGNUP_API, {
        firstName, lastName, username, email, mobileNumber, password, role,
      }).then((res) => res.data.status);

      if (status === 'OK') {
        alert('Signed up successfully!');
        setRouteRedirect(true);
      } else {
        handleWarning(status);
      }
    } else {
      handleWarning('Please input all forms!');
    }
  };

  const handleWarning = (message) => {
    setWarningMessage(message);
    setShowWarning(true);
  };

  const handleFirstNameInput = (e) => {
    setFirstName(e.target.value);
  };

  const handleLastNameInput = (e) => {
    setLastName(e.target.value);
  };

  const handleUsernameInput = (e) => {
    setUsername(e.target.value);
  };

  const handleEmailInput = (e) => {
    setEmail(e.target.value);
  };

  const handleMobileNumberInput = (e) => {
    setMobileNumber(e.target.value);
  };

  const handlePasswordInput = (e) => {
    setPassword(e.target.value);
  };

  const handleRadioShipper = (e) => {
    setRole(e.target.value);
  };

  const handleRadioDriver = (e) => {
    setRole(e.target.value);
  };

  useEffect(() => {
    const jwt_token = localStorage.getItem('jwt_token');
    setRouteRedirect(!!jwt_token);
  }, []);

  if (routeRedirect) {
    return <Redirect to="/" />;
  }

  return (
    <div>
      <h1> Sign Up: </h1>

      <form onSubmit={ fetchSignup }>
        { showWarning && <h3>{ warningMessage }</h3> }

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
          type="email"
          name="email"
          value={ email }
          onChange={ handleEmailInput }
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

        <label htmlFor="password"> Password: </label>
        <input
          type="password"
          name="password"
          value={ password }
          minLength="3"
          onChange={ handlePasswordInput }
          required
        />
        <hr />

        <div>
          <h4> You are: </h4>
          <input
            type="radio"
            id="driver"
            name="role"
            value="driver"
            onChange={ handleRadioDriver }
          />
          <label htmlFor="driver"> Driver </label>

          <input
            type="radio"
            id="shipper"
            name="role"
            value="shipper"
            onChange={ handleRadioShipper }
          />
          <label htmlFor="shipper"> Shipper </label>
        </div>
        <hr />

        <button type="submit"> Sign Up </button>

        <hr />

        <div className="navigation-panel">
          <Link to="/login"> Login </Link>

          <Link to="/"> Home Page </Link>
        </div>
      </form>
    </div>
  );
}
