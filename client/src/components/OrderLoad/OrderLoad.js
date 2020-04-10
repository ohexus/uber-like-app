/* eslint indent: ["error", 2, { "SwitchCase": 1 }] */
import React, { useState, useEffect, useContext } from 'react';
import './OrderLoad.scss';

import InfoTile from '../InfoTile/InfoTile';

import SocketContext from '../../context/SocketContext';

import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;
const CHECKFORLOAD_API = `${API_URL}/api/load/checkForLoad`;
const UPDATELOADSTATE_API = `${API_URL}/api/load/updateState`;
const FINISHLOAD_API = `${API_URL}/api/load/finish`;

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
      state: loadNextState,
    }, {
      headers: {
        authorization: localStorage.getItem('jwt_token'),
      },
    });
  };

  const finishOrder = async (e) => {
    e.preventDefault();

    await axios.put(FINISHLOAD_API, {
      loadId: load._id,
      state: loadNextState,
    }, {
      headers: {
        authorization: localStorage.getItem('jwt_token'),
      },
    });
  };

  const findNextState = (prev) => {
    switch (prev) {
      case 'En route to Pick Up':
        return 'Arrived to Pick Up';

      case 'Arrived to Pick Up':
        return 'En route to Delivery';

      case 'En route to Delivery':
        return 'Arrived to Delivery';

      case 'Arrived to Delivery':
        return 'Finish Order';

      default:
        return 'En route to Pick Up';
    }
  };

  const closeOrder = () => {
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
        const load = resLoad.load;

        setLoad(load);
        setLoadNextState(findNextState(load.state));
      } else {
        setNoOrderMessage(resLoad.status === 'No truck assigned'
          ? resLoad.status
          : 'You have no order, just chill :)');
      }
    };

    fetchLoad();
  }, []);

  useEffect(() => {
    socket.on('checkForLoad', (assignedLoad) =>
      setLoad(assignedLoad));

    socket.on('updateLoadState', (updatedLoad) => {
      setLoad(updatedLoad);
      setLoadNextState(findNextState(updatedLoad.state));
    });
  }, [socket, load]);

  return (
    <>
      { load
        ? <form
          className="order"
          onSubmit={ loadNextState === 'Arrived to Delivery'
            ? finishOrder
            : updateLoadState
          }
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

          { loadNextState === 'Finish Order'
            ? <button type="button" onClick={ closeOrder }> { loadNextState } </button>
            : <button type="submit"> { loadNextState } </button>
          }
        </form>
        : <h2>{ noOrderMessage }</h2>
      }
    </>
  );
}
