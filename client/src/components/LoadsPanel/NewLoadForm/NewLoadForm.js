import React, { useState } from 'react';
import './NewLoadForm.scss';

import checkBeforePostToServer from '../../../helpers/checkBeforePostToServer';

import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;
const CREATELOAD_API = `${API_URL}/api/load/create`;

export default function NewLoadForm(props) {
    const [loadName, setLoadName] = useState('');
    const [length, setLength] = useState(1);
    const [width, setWidth] = useState(1);
    const [height, setHeight] = useState(1);
    const [payload, setPayload] = useState(1);

    const [warningMessage] = useState('Please input all forms!');
    const [showWarning, setShowWarning] = useState(false);

    const createLoad = async (e) => {
        e.preventDefault()

        checkBeforePostToServer([loadName], setShowWarning);

        if (!showWarning && length !== 0 && width !== 0 && height !== 0 && payload !== 0) {
            await axios.post(CREATELOAD_API, {
                loadName, length, width, height, payload
            }, {
                headers: {
                    'authorization': localStorage.getItem('jwt_token')
                }
            });

            window.location.reload()
        }
    }

    const handleLoadNameInput = (e) => {
        setLoadName(e.target.value);
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
            {showWarning && <h3>{warningMessage}</h3>}

            <label htmlFor='loadName'> Name: </label>
            <input
                type='text'
                name='loadName'
                value={loadName}
                onChange={handleLoadNameInput}
                required
            />

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