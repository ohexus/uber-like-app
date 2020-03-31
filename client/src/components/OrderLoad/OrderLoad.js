import React, { useState, useEffect } from 'react';
import './OrderLoad.scss';

import axios from 'axios';
import InfoTile from '../InfoTile/InfoTile';
const API_URL = 'http://localhost:8081';
const CHECKFORLOAD_API = `${API_URL}/api/load/checkforload`;
const UPDATELOADSTATE_API = `${API_URL}/api/load/updatestate`;
const FINISHLOAD_API = `${API_URL}/api/load/finish`;

// load state transitions
// En route to Pick Up
// Arrived to Pick Up
// En route to Delivery
// Arrived to Delivery

export default function OrderLoad() {
    const [load, setLoad] = useState(null);
    const [dimensions, setDimensions] = useState(null);
    const [loadNextState, setLoadNextState] = useState('En route to Pick Up');
    const [showOrder, setShowOrder] = useState(true);
    
    const fetchLoad = async () => {
        const load = await axios.get(CHECKFORLOAD_API, {
            headers: {
                'authorization': localStorage.getItem('jwt_token')
            }
        }).then(res => res.data);
        
        setLoadNextState(findNextState(load.state));

        return load
    }
    
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
        await axios.put(FINISHLOAD_API, { 
            loadId: load._id,
            state: loadNextState
        }, {
            headers: {
                'authorization': localStorage.getItem('jwt_token')
            }
        });
    }

    const closeOrder = () => {
        setShowOrder(false);
    }
    
    useEffect(() => {
        (async() => setLoad(await fetchLoad()))();
        setDimensions(load ? load.dimensions : null);
    }, []);

    return (
        <>
            {load && dimensions && <>
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