import React, { useState } from 'react';
import './UserUpdateForm.scss';

import checkBeforePostToServer from '../../../helpers/checkBeforePostToServer';

import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;
const UPDATEUSER_API = `${API_URL}/api/user/updateUser`;

export default function UserUpdateForm(props) {
  const [user] = useState(props.user);

  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [mobileNumber, setMobileNumber] = useState(user.mobileNumber);

  const [warningMessage, setWarningMessage] = useState('');
  const [showWarning, setShowWarning] = useState(false);

  const updateUser = async (e) => {
    e.preventDefault();

    const isValid = checkBeforePostToServer([firstName, lastName, username, email, mobileNumber]);

    if (isValid) {
      const status = await axios.put(UPDATEUSER_API, {
        firstName, lastName, username, email, mobileNumber,
      }, {
        headers: {
          authorization: localStorage.getItem('jwt_token'),
        },
      }).then((res) => res.data.status);

      if (status === 'OK') {
        props.closeForm();
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

  return (

    <form className={ `updateuser ${props.className}` } onSubmit={ updateUser }>
      <h1> Update info: </h1>

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

      <button type="submit"> Submit update </button>

    </form>
  );
}
