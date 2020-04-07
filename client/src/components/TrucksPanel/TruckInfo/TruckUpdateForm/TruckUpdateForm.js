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

  const [warningMessage] = useState('Please input all forms!');
  const [showWarning, setShowWarning] = useState(false);

  const updateTruck = async (e) => {
    e.preventDefault();

    const isValid = checkBeforePostToServer([truckName, brand, model], setShowWarning);

    if (isValid) {
      await axios.put(UPDATETRUCK_API, {
        truckId: truck._id,
        type,
        truckName,
        brand,
        model,
      }, {
        headers: {
          authorization: localStorage.getItem('jwt_token'),
        },
      });
    }

    props.closeForm();
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
      { showWarning && <h3>{ warningMessage }</h3> }

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

      <button type="submit"> Submit Update </button>
    </form>
  );
}
