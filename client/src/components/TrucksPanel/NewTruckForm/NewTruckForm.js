import React, { useState } from 'react';
import './NewTruckForm.scss';

import checkBeforePostToServer from '../../../helpers/checkBeforePostToServer';

import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;
const CREATETRUCK_API = `${API_URL}/api/truck/create`;

export default function NewTruckForm(props) {
  const [type, setType] = useState('sprinter');
  const [truckName, setTruckName] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');

  const [warningMessage] = useState('Please input all forms!');
  const [showWarning, setShowWarning] = useState(false);

  const createTruck = async (e) => {
    e.preventDefault();

    const isValid = checkBeforePostToServer([truckName, brand, model], setShowWarning);

    if (isValid) {
      await axios.post(CREATETRUCK_API, {
        type, truckName, brand, model,
      }, {
        headers: {
          authorization: localStorage.getItem('jwt_token'),
        },
      });

      props.closeForm();
    }
  };

  const handleTypeSelect = (e) => {
    setType(e.target.value);
  };

  const handleTruckNameInput = (e) => {
    setTruckName(e.target.value);
  };

  const handleBrandInput = (e) => {
    setBrand(e.target.value);
  };

  const handleModelInput = (e) => {
    setModel(e.target.value);
  };

  return (
    <form
      className={ `newtruck ${props.className}` }
      onSubmit={ createTruck }
    >
      { showWarning && <h3>{ warningMessage }</h3> }

      <label htmlFor="type"> Type: </label>
      <select
        name="type"
        className="newtruck__types"
        onChange={ handleTypeSelect }
      >
        <option
          className="newtruck__type"
          value="sprinter"
        > Sprinter </option>

        <option
          className="newtruck__type"
          value="smallStraight"
        > Small Straight </option>

        <option
          className="newtruck__type"
          value="largeStraight"
        > Large Straight </option>

      </select>

      <label htmlFor="truckName"> Name: </label>
      <input
        type="text"
        name="truckName"
        value={ truckName }
        onChange={ handleTruckNameInput }
        required
      />

      <label htmlFor="brand"> Brand: </label>
      <input
        type="text"
        name="brand"
        value={ brand }
        onChange={ handleBrandInput }
        required
      />

      <label htmlFor="model"> Model: </label>
      <input
        type="text"
        name="model"
        value={ model }
        onChange={ handleModelInput }
        required
      />

      <button type="submit"> Create Truck </button>

    </form>
  );
}
