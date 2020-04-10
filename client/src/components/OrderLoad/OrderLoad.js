/* eslint indent: ["error", 2, { "SwitchCase": 1 }] */
import React, { useState, useEffect, useContext } from 'react';
import './OrderLoad.scss';

import InfoTile from '../InfoTile/InfoTile';

import SocketContext from '../../context/SocketContext';

import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;
const CHECKFORLOAD_API = `${API_URL}/api/load/checkForLoad`;
const UPDATELOADSTATE_API = `${API_URL}/api/load/updateState`;

// load state transitions
// En route to Pick Up
// Arrived to Pick Up
// En route to Delivery
// Arrived to Delivery

export default function OrderLoad() {
  const socket = useContext(SocketContext);

  const [load, setLoad] = useState(null);
  const [loadNextState, setLoadNextState] = useState('En route to Pick Up');

  const [noOrderMessage, setNoOrderMessage] = useState('');

  const updateLoadState = async (e) => {
    e.preventDefault();

    await axios.put(UPDATELOADSTATE_API, {
      loadId: load._id,
    }, {
      headers: {
        authorization: localStorage.getItem('jwt_token'),
      },
    });
  };

  const closeOrder = (e) => {
    e.preventDefault();

    setLoad(null);
    setNoOrderMessage('You have no order, just chill :)');
  };

  useEffect(() => {
    const fetchLoad = async () => {
      const resLoad = await axios.get(CHECKFORLOAD_API, {
        headers: {
          authorization: localStorage.getItem('jwt_token'),
        },
      }).then((res) => res.data);

      if (resLoad.status === 'OK') {
        setLoad(resLoad.load);
        setLoadNextState(resLoad.nextState);
      } else {
        setNoOrderMessage(resLoad.status === 'No truck assigned'
          ? resLoad.status
          : 'You have no order, just chill :)');
      }
    };

    fetchLoad();
  }, []);

  useEffect(() => {
    socket.on('checkForLoad', (res) => {
      setLoad(res.assignedLoad);
      setLoadNextState(res.nextState);
    });

    socket.on('updateLoadState', (res) => {
      setLoad(res.updatedLoad);
      setLoadNextState(res.nextState);
    });

    socket.on('assignTruck', () => {
      setNoOrderMessage('You have no order, just chill :)');
    });
  }, [socket, load]);

  return (
    <>
      { load
        ? <form
          className="order"
          onSubmit={ loadNextState !== 'Close Order'
            ? updateLoadState
            : closeOrder }
        >
          <h2> Your order: </h2>

          <InfoTile
            label={ 'Pick Up address:' }
            info={ load.address.pickUp }
          />

          <InfoTile
            label={ 'Delivery address:' }
            info={ load.address.delivery }
          />

          <InfoTile
            label={ 'State:' }
            info={ load.state }
          />

          <InfoTile
            label={ 'Length:' }
            info={ load.dimensions.length }
          />

          <InfoTile
            label={ 'Width:' }
            info={ load.dimensions.width }
          />

          <InfoTile
            label={ 'Height:' }
            info={ load.dimensions.height }
          />

          <InfoTile
            label={ 'Payload:' }
            info={ load.payload }
          />

          <button type="submit"> { loadNextState } </button>

        </form>
        : <h2>{ noOrderMessage }</h2>
      }
    </>
  );
}
