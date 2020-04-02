import React, { useState, useEffect, useCallback } from 'react';
import './DriversInfo.scss';

import InfoTile from '../../../InfoTile/InfoTile';

import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;
const GETASSIGNEDDRIVER_API = `${API_URL}/api/load/assignedDriver`;

export default function DriversInfo(props) {
    const [loadId] = useState(props.loadId)
    const [driver, setDriver] = useState(null);

    const fetchDriver = useCallback(async () => {
        const assignedDriver = await axios.post(GETASSIGNEDDRIVER_API, { loadId: loadId }, {
            headers: {
                'authorization': localStorage.getItem('jwt_token')
            }
        });

        setDriver(assignedDriver.data);
    }, [loadId, setDriver])
    
    useEffect(() => {
        if (!driver) {
            (async() => await fetchDriver())();
        }
    }, [driver, fetchDriver]);

    return (
        <>
            {driver && <div className='driver'>
                <h2 className='driver__header'> Drivers Info: </h2>

                <InfoTile
                    label={'First Name:'}
                    info={driver.firstName}
                />
                
                <InfoTile
                    label={'Last Name:'}
                    info={driver.lastName}
                />
                
                <InfoTile
                    label={'Email:'}
                    info={driver.email}
                />
                
                <InfoTile
                    label={'Mobile Number:'}
                    info={driver.mobileNumber}
                />
            </div>}
        </>
    );
}