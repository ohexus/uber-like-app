import React, { useState } from 'react';
import './LoadUpdateForm.scss';

import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;
const UPDATELOAD_API = `${API_URL}/api/load/updateInfo`;

export default function TruckUpdateForm(props) {
    const [load] = useState(props.load);
    const [dimensions] = useState(load.dimensions);

    const [length, setLength] = useState(dimensions.length);
    const [width, setWidth] = useState(dimensions.width);
    const [height, setHeight] = useState(dimensions.height);
    const [payload, setPayload] = useState(load.payload);
    
    const updateLoad = async () => {
        await axios.put(UPDATELOAD_API, { 
            loadId: load._id,
            length,
            width,
            height,
            payload
        }, {
            headers: {
                'authorization': localStorage.getItem('jwt_token')
            }
        });
    }
    
    const handleLengthInput = (e) => {
        setLength(e.target.value);
    }
    
    const handleWidthInput = (e) => {
        setWidth(e.target.value);
    }
    
    const handleHeightInput = (e) => {
        setHeight(e.target.value);
    }
    
    const handlePayloadInput = (e) => {
        setPayload(e.target.value);
    }

    return (
        <form 
            className={`updateload ${props.className}`} 
            onSubmit={updateLoad}
        >
            <label htmlFor='length'> Length: </label>
            <input 
                type='number'
                name='length'
                value={length}
                onChange={handleLengthInput}
                required 
            />
            
            <label htmlFor='width'> Width: </label>
            <input 
                type='number'
                name='width'
                value={width}
                onChange={handleWidthInput}
                required 
            />
            
            <label htmlFor='height'> Height: </label>
            <input 
                type='number'
                name='height'
                value={height}
                onChange={handleHeightInput}
                required 
            />
            
            <label htmlFor='payload'> Payload: </label>
            <input 
                type='number'
                name='payload'
                value={payload}
                onChange={handlePayloadInput}
                required 
            />

            <button type='submit'> Submit Update </button>
        </form>
    );
}