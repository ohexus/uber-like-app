import React, { useState } from 'react';
import './LoadInfo.scss';

import InfoTile from '../../InfoTile/InfoTile';
import LoadUpdateForm from './LoadUpdateForm/LoadUpdateForm';

import axios from 'axios';
const API_URL = 'http://localhost:8081';
const POSTLOAD_API = `${API_URL}/api/load/post`;
const ASSIGNLOAD_API = `${API_URL}/api/load/assign`;
const DELETELOAD_API = `${API_URL}/api/load/delete`;

export default function TruckInfo(props) {
    const [showLoadUpdateForm, setShowLoadUpdateForm] = useState(false);
    const [showAlertCantAssign, setShowAlertCantAssign] = useState(false);
    
    const load = props.load;
    const dimensions = load.dimensions;
    
    const postLoad = async (e) => {
        e.preventDefault()

        await axios.put(POSTLOAD_API, { loadId: load._id }, {
            headers: {
                'authorization': localStorage.getItem('jwt_token')
            }
        });

        await assignLoad();
    }
    
    const assignLoad = async () => {
        const updatedLoad = await axios.put(ASSIGNLOAD_API, { loadId: load._id }, {
            headers: {
                'authorization': localStorage.getItem('jwt_token')
            }
        }).then(res => res.data);

        if (updatedLoad.status === 'NEW') {
            setShowAlertCantAssign(true)
        } else {
            window.location.reload(false);
        }
    }
    
    const deleteLoad = async () => {
        await axios.delete(DELETELOAD_API, {
            data: {
                loadId: load._id
            },
            headers: {
                'authorization': localStorage.getItem('jwt_token')
            }
        });
        window.location.reload(false);
    }
    
    const toggleShowLoadUpdateForm = () => {
        setShowLoadUpdateForm(!showLoadUpdateForm);
    }

    return (
        <div className="load-wrapper">
            <form className='load' onSubmit={postLoad}>
                <h4 className='load__assigned'>{load.assigned_to
                    ? 'Assigned'
                    : 'Not assigned'
                }</h4>

                {showAlertCantAssign && <h5>
                    All matched trucks is on load, try again later
                </h5>}
                
                {!load.assigned_to && <button type="submit"> Post this load </button>}

                <InfoTile
                    label={'Assigned to:'}
                    info={load.assigned_to}
                />

                <InfoTile
                    label={'Status:'}
                    info={load.status}
                />

                <InfoTile
                    label={'State:'}
                    info={load.state}
                />

                <InfoTile
                    label={'Length:'}
                    info={dimensions.length}
                />

                <InfoTile
                    label={'Width:'}
                    info={dimensions.width}
                />

                <InfoTile
                    label={'Height:'}
                    info={dimensions.height}
                />

                <InfoTile
                    label={'Payload:'}
                    info={load.payload}
                />

                {!load.assigned_to && 
                    <button type='button' onClick={deleteLoad}>
                        Delete this load
                    </button>
                }
            </form>

            {!load.assigned_to && <button type='button' onClick={toggleShowLoadUpdateForm}>
                    {showLoadUpdateForm
                        ? 'Close update Load Info'
                        : 'Update Load Info'
                    }
                </button>
            }

            {showLoadUpdateForm && <LoadUpdateForm load={load} className='load-wrapper__updateload' />}
        </div>
    );
}