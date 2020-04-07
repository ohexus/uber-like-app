import React, { useState, useEffect, useContext } from 'react';
import './LoadInfo.scss';

import InfoTile from '../../InfoTile/InfoTile';
import LoadUpdateForm from './LoadUpdateForm/LoadUpdateForm';
import DriversInfo from './DriversInfo/DriversInfo';
import ReportDownloadPanel from './ReportDownloadPanel/ReportDownloadPanel';

import SocketContext from '../../../context/SocketContext';

import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;
const POSTLOAD_API = `${API_URL}/api/load/post`;
const ASSIGNLOAD_API = `${API_URL}/api/load/assign`;
const DELETELOAD_API = `${API_URL}/api/load/delete`;

export default function LoadInfo(props) {
  const socket = useContext(SocketContext);

  const [load, setLoad] = useState(props.load);
  const [isLoadFinished] = useState(load.status === 'SHIPPED');
  const [hasCooords] = useState(props.load.coord.pickUp.lat !== null && props.load.coord.delivery.lat !== null);

  const [showLoadUpdateForm, setShowLoadUpdateForm] = useState(false);
  const [showWarningCantAssign, setShowWarningCantAssign] = useState(false);
  const [showWarningHasNoCoords, setShowWarningHasNoCoords] = useState(false);

  const postLoad = async (e) => {
    e.preventDefault();

    if (hasCooords) {
      await axios.put(POSTLOAD_API, { loadId: load._id }, {
        headers: {
          authorization: localStorage.getItem('jwt_token'),
        },
      });

      await assignLoad();
    } else {
      setShowWarningHasNoCoords(true);
    }
  };

  const assignLoad = async () => {
    const assignedLoad = await axios.put(ASSIGNLOAD_API, { loadId: load._id }, {
      headers: {
        authorization: localStorage.getItem('jwt_token'),
      },
    }).then((res) => res.data);

    if (assignedLoad.status !== 'ASSIGNED') {
      setShowWarningCantAssign(true);
    } else {
      setShowWarningCantAssign(false);
    }
  };

  const deleteLoad = async (e) => {
    e.preventDefault();

    await axios.delete(DELETELOAD_API, {
      data: {
        loadId: load._id,
      },
      headers: {
        authorization: localStorage.getItem('jwt_token'),
      },
    });
  };

  const toggleShowLoadUpdateForm = () => {
    setShowLoadUpdateForm(!showLoadUpdateForm);
  };

  useEffect(() => {
    let isExist = true;

    socket.on('updateLoadInfo', (updatedLoad) => {
      if (isExist) {
        if (load._id === updatedLoad._id) {
          setLoad(updatedLoad);
        }
      }
    });

    socket.on('postLoad', (postedLoad) => {
      if (isExist) {
        if (load._id === postedLoad._id) {
          setLoad(postedLoad);
        }
      }
    });

    socket.on('assignLoad', (assignedLoad) => {
      if (isExist) {
        if (load._id === assignedLoad._id) {
          setLoad(assignedLoad);
          setShowWarningCantAssign(false);
        }
      }
    });

    return () => isExist = false;
  }, [socket, load]);

  return (
    <div className="load-wrapper">
      <form className="load" onSubmit={ postLoad }>
        <InfoTile
          label={ 'Loads name:' }
          info={ load.loadName }
        />

        { !isLoadFinished && <h4 className="load__assigned">
          { load.assigned_to
            ? 'Assigned'
            : 'Not assigned'
          }
        </h4> }

        { load.status === 'POSTED' && <h4 className="load__assigned">
          Load posted. Looking for a driver...
        </h4> }

        { showWarningHasNoCoords && <h5>
          This load has no Pick Up and Delivery coordinates
        </h5> }

        { showWarningCantAssign && <h5>
          All matched trucks is on load, try again later
        </h5> }

        { !isLoadFinished && !showWarningHasNoCoords && <>
          { !load.assigned_to && <button type="submit"> Post this load </button> }
        </> }

        { load.assigned_to && <DriversInfo loadId={ load._id } /> }

        <div className="load__address">
          <h3> Addresses: </h3>
          { load.address.pickUp && load.address.delivery
            ? <>
              <InfoTile
                label={ 'Pick Up address:' }
                info={ load.address.pickUp }
              />

              <InfoTile
                label={ 'Delivery address:' }
                info={ load.address.delivery }
              />
            </>
            : 'update coordinates'
          }
        </div>

        <InfoTile
          label={ 'Status:' }
          info={ load.status }
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

        { !isLoadFinished && <>
          { !load.assigned_to && <button type="button" onClick={ deleteLoad }>
            Delete this load
          </button> }
        </> }
      </form>

      { !isLoadFinished && <>
        { !load.assigned_to && <button type="button" onClick={ toggleShowLoadUpdateForm }>
          { showLoadUpdateForm
            ? 'Close update Load Info'
            : 'Update Load Info'
          }
        </button>
        }
      </> }

      { !isLoadFinished && <>
        { showLoadUpdateForm && <LoadUpdateForm
          load={ load }
          className="load-wrapper__updateload"
          closeForm={ () => setShowLoadUpdateForm(false) }
        /> }
      </> }

      { isLoadFinished && <ReportDownloadPanel load={ load } /> }
    </div>
  );
}
