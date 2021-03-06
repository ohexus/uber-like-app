import React, { useState } from 'react';
import './NewLoadForm.scss';

import checkBeforePostToServer from '../../../helpers/checkBeforePostToServer';

import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;
const CREATELOAD_API = `${API_URL}/api/load/create`;

export default function NewLoadForm(props) {
  const [loadName, setLoadName] = useState('');
  const [length, setLength] = useState(1);
  const [width, setWidth] = useState(1);
  const [height, setHeight] = useState(1);
  const [payload, setPayload] = useState(1);

  const [warningMessage, setWarningMessage] = useState('Please input all forms!');
  const [showWarning, setShowWarning] = useState(false);

  const createLoad = async (e) => {
    e.preventDefault();

    setShowWarning(false);
    setWarningMessage('Please input all forms!');
    const isValid = checkBeforePostToServer([loadName]);

    if (isValid) {
      if (length > 0 && width > 0 && height > 0 && payload > 0) {
        await axios.post(CREATELOAD_API, {
          loadName, length, width, height, payload,
        }, {
          headers: {
            authorization: localStorage.getItem('jwt_token'),
          },
        });

        props.closeForm();
      } else {
        setWarningMessage('Dimensions and payload cant be less then 1!');
        setShowWarning(true);
      }
    } else {
      setShowWarning(true);
    }
  };

  const handleLoadNameInput = (e) => {
    setLoadName(e.target.value);
  };

  const handleLengthInput = (e) => {
    setLength(e.target.value);
  };

  const handleWidthInput = (e) => {
    setWidth(e.target.value);
  };

  const handleHeightInput = (e) => {
    setHeight(e.target.value);
  };

  const handlePayloadInput = (e) => {
    setPayload(e.target.value);
  };

  return (
    <form
      className={ `newload ${props.className}` }
      onSubmit={ createLoad }
    >
      { showWarning && <h3>{ warningMessage }</h3> }

      <label htmlFor="loadName"> Name: </label>
      <input
        type="text"
        name="loadName"
        value={ loadName }
        minLength="3"
        onChange={ handleLoadNameInput }
        required
      />

      <label htmlFor="length"> Length: </label>
      <input
        type="number"
        name="length"
        value={ length }
        min="1"
        onChange={ handleLengthInput }
        required
      />

      <label htmlFor="width"> Width: </label>
      <input
        type="number"
        name="width"
        value={ width }
        min="1"
        onChange={ handleWidthInput }
        required
      />

      <label htmlFor="height"> Height: </label>
      <input
        type="number"
        name="height"
        value={ height }
        min="1"
        onChange={ handleHeightInput }
        required
      />

      <label htmlFor="payload"> Payload: </label>
      <input
        type="number"
        name="payload"
        value={ payload }
        min="1"
        onChange={ handlePayloadInput }
        required
      />

      <button type="submit"> Create Load </button>

    </form>
  );
}
