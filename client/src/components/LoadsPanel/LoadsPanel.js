import React, { useState, useEffect } from 'react';
import './LoadsPanel.scss';

import LoadInfo from './LoadInfo/LoadInfo';
import NewLoadForm from './NewLoadForm/NewLoadForm';

import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;
const LOADS_API = `${API_URL}/api/load/allForUser`;

export default function LoadsPanel() {
    const [loads, setLoads] = useState(null);
    const [filteredLoads, setFilteredLoads] = useState(null);
    const [showNewLoadForm, setShowNewloadForm] = useState(false);

    const fetchLoads = async() => {
        const loads = await axios.get(LOADS_API, {
            headers: {
                'authorization': localStorage.getItem('jwt_token')
            }
        });
    
        return loads.data;
    }
    
    const toggleShowNewLoadForm = () => {
        setShowNewloadForm(!showNewLoadForm);
    }
    
    const handleFilterSelect = (e) => {
        if (loads) {
            if (e.target.value !== '') {
                setFilteredLoads(loads.filter(load => load.status === e.target.value));
            } else {
                setFilteredLoads(loads);
            }
        }
    }
    
    useEffect(() => {
        (async() => {
            const loads = await fetchLoads();
            setLoads(loads);
            setFilteredLoads(loads);
        })();
    }, []);

    return (
        <div className='loads'>
            <h2 className='loads__header'> Your Loads: </h2>

            <button 
                type='button'
                onClick={toggleShowNewLoadForm}
            >
                {showNewLoadForm
                    ? 'Close Load form'
                    : 'Create new Load'
                }
            </button>

            {showNewLoadForm && <NewLoadForm className='loads__newload' />}

            <div className='loads__filter'>
                <label htmlFor='type'> Filter: </label>
                <select 
                    name='type'
                    className='loads__select'
                    onChange={handleFilterSelect}
                >
                    <option 
                        className='loads__option'
                        value=''
                    > All </option>

                    <option 
                        className='loads__option'
                        value='NEW'
                    > NEW </option>
                    
                    <option 
                        className='loads__option'
                        value='POSTED'
                    > POSTED </option>

                    <option 
                        className='loads__option'
                        value='ASSIGNED'
                    > ASSIGNED </option>

                    <option 
                        className='loads__option'
                        value='SHIPPED'
                    > SHIPPED </option>
                </select>
            </div>

            {filteredLoads
                ? <div className='loads__panel'>
                    {filteredLoads.map(load => {
                        return <LoadInfo
                                    key={load._id}
                                    load={load} 
                                />
                    })}
                </div>
                : <h3> You have not added any loads </h3>
            }
        </div>
    );
}