import React, { useState } from 'react';
import './TruckUpdateForm.scss';

import checkBeforePostToServer from '../../../../helpers/checkBeforePostToServer';

import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;
const UPDATETRUCK_API = `${API_URL}/api/truck/update`;

export default function TruckUpdateForm(props) {
  const [truck] = useState(props.truck);

  const [type, setType] = useState('sprinter');
  const [truckName, setTruckName] = useState(truck.truckName);
  const [brand, setBrand] = useState(truck.brand);
  const [model, setModel] = useState(truck.model);

  const [warningMessage, setWarningMessage] = useState('');
  const [showWarning, setShowWarning] = useState(false);

  const updateTruck = async (e) => {
    e.preventDefault();

    const isValid = checkBeforePostToServer([truckName, brand, model], setShowWarning);

    if (isValid) {
      const status = await axios.put(UPDATETRUCK_API, {
        truckId: truck._id,
        type,
        truckName,
        brand,
        model,
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
    }
  };

  const handleWarning = (message) => {
    setWarningMessage(message);
    setShowWarning(true);
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
      className={ `updatetruck ${props.className}` }
      onSubmit={ updateTruck }
    >
      { showWarning && <span>{ warningMessage }</span> }

      <label htmlFor="type"> Type: </label>
      <select
        name="type"
        className="updatetruck__types"
        onChange={ handleTypeSelect }
      >
        <option
          className="updatetruck__type"
          value="sprinter"
        > Sprinter </option>

        <option
          className="updatetruck__type"
          value="smallStraight"
        > Small Straight </option>

        <option
          className="updatetruck__type"
          value="largeStraight"
        > Large Straight </option>

      </select>

      <label htmlFor="truckName"> Name: </label>
      <input
        type="text"
        name="truckName"
        value={ truckName }
        minLength="3"
        onChange={ handleTruckNameInput }
        required
      />

      <label htmlFor="brand"> Brand: </label>
      <input
        type="text"
        name="brand"
        value={ brand }
        minLength="3"
        onChange={ handleBrandInput }
        required
      />

      <label htmlFor="model"> Model: </label>
      <input
        type="text"
        name="model"
        value={ model }
        minLength="3"
        onChange={ handleModelInput }
        required
      />

      <button type="submit"> Submit Update </button>
    </form>
  );
}
