import React, { useState } from 'react';
import './LoadInfo.scss';

import InfoTile from '../../InfoTile/InfoTile';
import LoadUpdateForm from './LoadUpdateForm/LoadUpdateForm';
import DriversInfo from './DriversInfo/DriversInfo';

import axios from 'axios';
import ReportDownloadPanel from './ReportDownloadPanel/ReportDownloadPanel';
const API_URL = process.env.REACT_APP_API_URL;
const POSTLOAD_API = `${API_URL}/api/load/post`;
const ASSIGNLOAD_API = `${API_URL}/api/load/assign`;
const DELETELOAD_API = `${API_URL}/api/load/delete`;

export default function LoadInfo(props) {
    const [load] = useState(props.load);
    const [dimensions] = useState(load.dimensions);
    const [isLoadFinished] = useState(load.status === 'SHIPPED');

    const [showLoadUpdateForm, setShowLoadUpdateForm] = useState(false);
    const [showAlertCantAssign, setShowAlertCantAssign] = useState(false);

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
                <InfoTile
                    label={'Loads name:'}
                    info={load.loadName}
                />

                {!isLoadFinished && <h4 className='load__assigned'>
                    {load.assigned_to
                        ? 'Assigned'
                        : 'Not assigned'
                    }
                </h4>}

                {showAlertCantAssign && <h5>
                    All matched trucks is on load, try again later
                </h5>}

                {!isLoadFinished && <>
                    {!load.assigned_to && <button type="submit"> Post this load </button>}
                </>}

                {load.assigned_to && <DriversInfo loadId={load._id} />}

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

                {!isLoadFinished && <>
                    {!load.assigned_to &&
                        <button type='button' onClick={deleteLoad}>
                            Delete this load
                        </button>
                    }
                </>}
            </form>

            {!isLoadFinished && <>
                {!load.assigned_to && <button type='button' onClick={toggleShowLoadUpdateForm}>
                    {showLoadUpdateForm
                        ? 'Close update Load Info'
                        : 'Update Load Info'
                    }
                </button>
                }
            </>}

            {!isLoadFinished && <>
                {showLoadUpdateForm && <LoadUpdateForm load={load} className='load-wrapper__updateload' />}
            </>}

            {isLoadFinished && <ReportDownloadPanel load={load} />}
        </div>
    );
}