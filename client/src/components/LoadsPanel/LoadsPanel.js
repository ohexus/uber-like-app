import React, { useState, useEffect } from 'react';
import './LoadsPanel.scss';

import LoadInfo from './LoadInfo/LoadInfo';
import NewLoadForm from './NewLoadForm/NewLoadForm';

import axios from 'axios';
const API_URL = 'http://localhost:8081';
const LOADS_API = `${API_URL}/api/load/allforuser`;

export default function LoadsPanel() {
    const [loads, setLoads] = useState(null);
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
    
    useEffect(() => {
        (async() => setLoads(await fetchLoads()))();
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

            {loads
                ? <div className='loads__panel'>
                    {loads.map(load => {
                        return <LoadInfo
                                    key={load._id}
                                    load={load} 
                                />
                    })}
                </div>
                : <h3>You have not added any loads</h3>
            }
        </div>
    );
}