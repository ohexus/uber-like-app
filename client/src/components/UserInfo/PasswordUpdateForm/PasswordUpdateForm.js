import React, { useState } from 'react';

import './PasswordUpdateForm.scss';

import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;
const UPDATEPASSWORD_API = `${API_URL}/api/user/updatePassword`;

export default function PasswordUpdateForm(props) {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [checkNewPassword, setCheckNewPassword] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlertMessage, setShowAlertMessage] = useState(false);

  const updatePassword = async () => {
    const validPasswordStatus = await axios.put(UPDATEPASSWORD_API, {
      oldPassword,
      newPassword,
    }, {
      headers: {
        authorization: localStorage.getItem('jwt_token'),
      },
    }).then((res) => res.data.status);

    if (validPasswordStatus !== 'successful updated password') {
      handleAlert(validPasswordStatus);
    } else {
      props.closeForm();
    }
  };

  const checkUpdatePassword = (e) => {
    e.preventDefault();

    if (newPassword === oldPassword) {
      return handleAlert('The new password must be different!');
    }

    if (newPassword === checkNewPassword) {
      updatePassword();
    } else {
      return handleAlert('New passwords does not match!');
    }
  };

  const handleAlert = (message) => {
    setAlertMessage(message);
    setShowAlertMessage(true);
  };

  const handleOldPasswordInput = (e) => {
    setOldPassword(e.target.value);
  };

  const handleNewPasswordInput = (e) => {
    setNewPassword(e.target.value);
  };

  const handleCheckNewPasswordInput = (e) => {
    setCheckNewPassword(e.target.value);
  };

  return (
    <form className={ `updatepassword ${props.className}` } onSubmit={ checkUpdatePassword }>
      <h1> Password Update: </h1>

      { showAlertMessage && <span className="updatepassword__alert"> { alertMessage } </span> }

      <label htmlFor="oldPassword"> Old password: </label>
      <input
        type="password"
        name="oldPassword"
        value={ oldPassword }
        minLength="3"
        onChange={ handleOldPasswordInput }
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

      <button type="submit"> Submit password update </button>

    </form>
  );
}
