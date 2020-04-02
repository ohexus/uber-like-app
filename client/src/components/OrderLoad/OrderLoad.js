import React, { useState, useEffect, useCallback } from 'react';
import './OrderLoad.scss';

import InfoTile from '../InfoTile/InfoTile';

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
    const [load, setLoad] = useState(null);
    const [loadNextState, setLoadNextState] = useState('En route to Pick Up');
    const [showOrder, setShowOrder] = useState(true);
    
    const fetchLoad = useCallback(async () => {
        const load = await axios.get(CHECKFORLOAD_API, {
            headers: {
                'authorization': localStorage.getItem('jwt_token')
            }
        }).then(res => res.data);
        
        setLoadNextState(findNextState(load.state));

        return ((load.status !== 'Nothing' && load.status !== 'No truck assigned') ? load : null)
    }, [])
    
    const updateLoadState = async (e) => {
        await axios.put(UPDATELOADSTATE_API, { 
            loadId: load._id,
            state: loadNextState
        }, {
            headers: {
                'authorization': localStorage.getItem('jwt_token')
            }
        });
    }

    const findNextState = (prev) => {
        switch (prev) {
            case 'En route to Pick Up':
                return 'Arrived to Pick Up'

            case 'Arrived to Pick Up':
                return 'En route to Delivery'

            case 'En route to Delivery':
                return 'Arrived to Delivery'

            case 'Arrived to Delivery':
                return 'Finish Order'

            default:
                return 'En route to Pick Up'
        }
    }

    const finishOrder = async () => {
        const finishedLoad = await axios.put(FINISHLOAD_API, { 
            loadId: load._id,
            state: loadNextState
        }, {
            headers: {
                'authorization': localStorage.getItem('jwt_token')
            }
        });

        setLoad(finishedLoad);
    }

    const closeOrder = () => {
        setShowOrder(false);
    }
    
    useEffect(() => {
        (async() => setLoad(await fetchLoad()))();
    }, [setLoad, fetchLoad]);

    return (
        <>
            {load && <>
                {showOrder &&
                    <form 
                        className='order'
                        onSubmit={loadNextState === 'Arrived to Delivery'
                            ? finishOrder
                            : updateLoadState
                        }
                    >
                        <h2> Your order: </h2>

                        <InfoTile 
                            label={'State:'}
                            info={load.state}
                        />
                        
                        <InfoTile 
                            label={'Length:'}
                            info={load.dimensions.length}
                        />
                        
                        <InfoTile 
                            label={'Width:'}
                            info={load.dimensions.width}
                        />
                        
                        <InfoTile 
                            label={'Height:'}
                            info={load.dimensions.height}
                        />
                        
                        <InfoTile 
                            label={'Payload:'}
                            info={load.payload}
                        />

                        {loadNextState === 'Finish Order'
                            ? <button type='button' onClick={closeOrder}> {loadNextState} </button>
                            : <button type='submit'> {loadNextState} </button>
                        }
                    </form>
                }
            </>}
        </>
    );
}