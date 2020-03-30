import React from 'react';
import './TruckInfo.scss';

import InfoTile from '../../InfoTile/InfoTile';

import axios from 'axios';
const API_URL = 'http://localhost:8081';
const ASSIGNTRUCK_API = `${API_URL}/api/truck/assign`;
const DELETETRUCK_API = `${API_URL}/api/truck/delete`;

export default function TruckInfo(props) {
    
    const truck = props.truck;
    
    const assignTruck = async () => {
        await axios.put(ASSIGNTRUCK_API, { truckId: truck._id }, {
            headers: {
                'authorization': localStorage.getItem('jwt_token')
            }
        });
    }
    
    const deleteTruck = async () => {
        await axios.delete(DELETETRUCK_API, {
            data: {
                truckId: truck._id
            },
            headers: {
                'authorization': localStorage.getItem('jwt_token')
            }
        });
        window.location.reload(false);
    }

    return (
        <form className='truck' onSubmit={assignTruck}>
            <h3 className='truck__name'>{truck.truckName.toUpperCase()}</h3>
            <h4 className='truck__assigned'>{truck.assigned_to
                ? 'Assigned'
                : 'Not assigned'
            }</h4>
            
            <button type="submit"> Assign this truck </button>

            <InfoTile
                label={'Brand:'}
                info={truck.brand}
            />

            <InfoTile
                label={'Model:'}
                info={truck.model}
            />

            <InfoTile
                label={'Type:'}
                info={truck.type}
            />

            <InfoTile
                label={'Status:'}
                info={truck.status}
            />

            {!truck.assigned_to && 
                <button type='button' onClick={deleteTruck}>
                    Delete this truck
                </button>
            }
        </form>
    );
}