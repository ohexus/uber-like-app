import React, { useState, useEffect, useCallback } from 'react';
import './UserAvatar.scss';

import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;
const UPDATEAVATAR_API = `${API_URL}/api/user/updateAvatar`;

export default function UserAvatar(props) {
  const [contentType] = useState(props.undecodedImg.contentType);
  const [buffer] = useState(props.undecodedImg.data.data);

  const [decodedImg, setDecodedImg] = useState('');
  const [newAvatar, setNewAvatar] = useState(null);

  const [showAvatarUpdateForm, setShowAvatarUpdateForm] = useState(false);

  const updateAvatar = async (e) => {
    const form = new FormData();
    form.append('avatar', newAvatar);

    await axios.put(UPDATEAVATAR_API, form, {
      headers: {
        authorization: localStorage.getItem('jwt_token'),
      },
    });
  };

  const handleNewAvatarInput = (e) => {
    setNewAvatar(e.target.files[0]);
  };

  const toggleShowAvatarUpdateForm = () => {
    setShowAvatarUpdateForm(!showAvatarUpdateForm);
  };

  const decodeImage = useCallback(() => {
    const base64Flag = `data:${contentType};base64,`;
    const imageStr = arrayBufferToBase64(buffer);
    setDecodedImg(base64Flag + imageStr);
  }, [contentType, buffer]);

  const arrayBufferToBase64 = (buff) => {
    const bytes = [].slice.call(new Uint8Array(buff));
    const binary = bytes.reduce((prevBytes, nextByte) => prevBytes + String.fromCharCode(nextByte), '');

    return window.btoa(binary);
  };

  useEffect(() => {
    decodeImage();
  }, [decodeImage]);

  return (
    <div className="user__avatar-wrapper">
      <img className="user__avatar" src={ decodedImg } alt="avatar" />
      <button type="button" onClick={ toggleShowAvatarUpdateForm }>
        { showAvatarUpdateForm
          ? 'Close update Avatar'
          : 'Update Avatar'
        }
      </button>
      { showAvatarUpdateForm && <form onSubmit={ updateAvatar }>
        <input type="file" name="avatar" onChange={ handleNewAvatarInput } />
        { newAvatar && <button type="submit"> Update!! </button> }
      </form> }
    </div>
  );
}
