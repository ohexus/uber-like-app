import React, { useState, useEffect, useContext } from 'react';
import './LoadsPanel.scss';

import NewLoadForm from './NewLoadForm/NewLoadForm';
import LoadsShelf from './LoadsShelf/LoadsShelf';
import Pagination from '../Pagination/Pagination';

import SocketContext from '../../context/SocketContext';

import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;
const LOADS_API = `${API_URL}/api/load/allForUser`;

export default function LoadsPanel() {
  const socket = useContext(SocketContext);

  const [loads, setLoads] = useState(null);
  const [filteredLoads, setFilteredLoads] = useState(null);
  const [filterCriteria, setFilterCriteria] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [loadsPerPage] = useState(5);

  const [showNewLoadForm, setShowNewloadForm] = useState(false);

  const toggleShowNewLoadForm = () => {
    setShowNewloadForm(!showNewLoadForm);
  };

  const handleFilterSelect = (e) => {
    setFilterCriteria(e.target.value);
  };

  useEffect(() => {
    const fetchLoads = async () => {
      const loads = await axios.get(LOADS_API, {
        headers: {
          authorization: localStorage.getItem('jwt_token'),
        },
      }).then((res) => res.data.loads);

      setLoads(loads);
      setFilteredLoads(loads);
    };

    fetchLoads();
  }, []);

  useEffect(() => {
    if (loads) {
      socket.on('createLoad', (newLoad) => {
        setLoads([...loads, newLoad]);
      });

      socket.on('assignLoad', (assignedLoad) => {
        setLoads(loads.map((load) => {
          return load._id === assignedLoad._id ? assignedLoad : load;
        }));
      });

      socket.on('deleteLoad', (deletedLoad) => {
        setLoads(loads.filter((load) =>
          load._id !== deletedLoad._id));
      });
    }
  }, [socket, loads]);

  useEffect(() => {
    if (loads) {
      if (filterCriteria === '') {
        setFilteredLoads(loads);
      } else {
        setFilteredLoads(loads.filter((load) => load.status === filterCriteria));
      }
    }
  }, [loads, filterCriteria]);

  const indexLast = currentPage * loadsPerPage;
  const indexFirst = indexLast - loadsPerPage;
  const currentLoads = filteredLoads ? filteredLoads.slice(indexFirst, indexLast) : [];

  const paginate = (pageNum) => setCurrentPage(pageNum);

  return (
    <div className="loads">
      <h2 className="loads__header"> Your Loads: </h2>

      <button
        type="button"
        onClick={ toggleShowNewLoadForm }
      >
        { showNewLoadForm
          ? 'Close Load form'
          : 'Create new Load'
        }
      </button>

      { showNewLoadForm && <NewLoadForm
        className="loads__newload"
        closeForm={ () => setShowNewloadForm(false) }
      /> }

      <div className="loads__filter">
        <label htmlFor="type"> Filter: </label>
        <select
          name="type"
          className="loads__select"
          onChange={ handleFilterSelect }
        >
          <option
            className="loads__option"
            value=""
          > All </option>

          <option
            className="loads__option"
            value="NEW"
          > NEW </option>

          <option
            className="loads__option"
            value="POSTED"
          > POSTED </option>

          <option
            className="loads__option"
            value="ASSIGNED"
          > ASSIGNED </option>

          <option
            className="loads__option"
            value="SHIPPED"
          > SHIPPED </option>
        </select>
      </div>

      { filteredLoads
        ? <div className="loads__panel">
          <LoadsShelf loads={ currentLoads } />

          <Pagination
            itemsPerPage={ loadsPerPage }
            total={ filteredLoads.length }
            paginate={ paginate }
          />
        </div>
        : <h3> You have not added any loads </h3>
      }
    </div>
  );
}
