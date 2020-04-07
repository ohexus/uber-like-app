import React, { useState, useEffect } from 'react';
import { Redirect, Link } from 'react-router-dom';

import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;
const LOGIN_API = `${API_URL}/api/auth/login`;

export default function LoginPage() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  const [warningMessage, setWarningMessage] = useState('');
  const [showWarning, setShowWarning] = useState(false);

  const [routeRedirect, setRouteRedirect] = useState(false);

  const fetchLogin = async (e) => {
    e.preventDefault();

    const resJson = await axios.post(LOGIN_API, {
      login, password,
    }).then((res) => res.data);

    if (resJson.status === 'OK') {
      localStorage.setItem('jwt_token', resJson.jwt_token);
      setRouteRedirect(true);
    } else {
      handleWarning(resJson.status);
    }
  };

  const handleWarning = (message) => {
    setWarningMessage(message);
    setShowWarning(true);
  };

  const handleLoginInput = (e) => {
    setLogin(e.target.value);
  };

  const handlePasswordInput = (e) => {
    setPassword(e.target.value);
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
      <h1> LOGIN: </h1>
      <form onSubmit={ fetchLogin }>
        { showWarning && <h3>{ warningMessage }</h3> }

        <label htmlFor="login"> Email or Username: </label>
        <input
          type="text"
          name="login"
          value={ login }
          minLength="3"
          onChange={ handleLoginInput }
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

        <Link to="/password-recovery"> forgot password? </Link>

        <button type="submit"> Login </button>

        <hr />

        <div className="navigation-panel">
          <Link to="/signup"> Sign up </Link>

          <Link to="/"> Home Page </Link>
        </div>
      </form>
    </div>
  );
}
