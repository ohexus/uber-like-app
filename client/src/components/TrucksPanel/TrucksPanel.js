import React, { useState, useEffect } from 'react';
import './TrucksPanel.scss';

import TruckInfo from './TruckInfo/TruckInfo';
import NewTruckForm from './NewTruckForm/NewTruckForm';

import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;
const TRUCKS_API = `${API_URL}/api/truck/allForUser`;

export default function TrucksPanel() {
  const [trucks, setTrucks] = useState(null);
  const [showNewTruckForm, setShowNewTruckForm] = useState(false);

  const toggleShowNewTruckForm = () => {
    setShowNewTruckForm(!showNewTruckForm);
  };

  useEffect(() => {
    const fetchTrucks = async () => {
      const trucks = await axios.get(TRUCKS_API, {
        headers: {
          authorization: localStorage.getItem('jwt_token'),
        },
      }).then((res) => res.data);

      setTrucks(trucks);
    };

    fetchTrucks();
  }, []);

  return (
    <div className="trucks">
      <h2 className="trucks__header"> Your Trucks: </h2>

      <button
        type="button"
        onClick={ toggleShowNewTruckForm }
      >
        { showNewTruckForm
          ? 'Close Truck form'
          : 'Create new Truck'
        }
      </button>

      { showNewTruckForm && <NewTruckForm className="trucks__newtruck" /> }

      { trucks
        ? <div className="trucks__panel">
          { trucks.map((truck) => (<TruckInfo
            key={ truck._id }
            truck={ truck }
          />)) }
        </div>
        : <h3>You have not added any trucks</h3>
      }
    </div>
  );
}
