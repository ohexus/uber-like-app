import React, { useState } from 'react';
import './NewLoadForm.scss';

import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;
const CREATELOAD_API = `${API_URL}/api/load/create`;

export default function NewLoadForm(props) {
    const [length, setLength] = useState(1);
    const [width, setWidth] = useState(1);
    const [height, setHeight] = useState(1);
    const [payload, setPayload] = useState(1);
    
    const createLoad = async () => {
        await axios.post(CREATELOAD_API, {
            length, width, height, payload
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
            className={`newload ${props.className}`} 
            onSubmit={createLoad}
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

            <button type='submit'> Create Load </button>

        </form>
    );
}