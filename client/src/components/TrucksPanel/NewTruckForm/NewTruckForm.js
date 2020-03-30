import React, { useState } from 'react';
import './NewTruckForm.scss';

import axios from 'axios';
const API_URL = 'http://localhost:8081';
const CREATETRUCK_API = `${API_URL}/api/truck/create`;

export default function NewTruckForm(props) {
    const [type, setType] = useState('stringer');
    const [truckName, setTruckName] = useState('');
    const [brand, setBrand] = useState('');
    const [model, setModel] = useState('');
    
    const createTruck = async () => {
        await axios.post(CREATETRUCK_API, {
            type: type,
            truckName: truckName,
            brand: brand,
            model: model
        }, {
            headers: {
                'authorization': localStorage.getItem('jwt_token')
            }
        });
    }
    
    const handleTypeSelect = (e) => {
        setType(e.target.value);
    }
    
    const handleTruckNameInput = (e) => {
        setTruckName(e.target.value);
    }
    
    const handleBrandInput = (e) => {
        setBrand(e.target.value);
    }
    
    const handleModelInput = (e) => {
        setModel(e.target.value);
    }

    return (
        <form 
            className={`newtruck ${props.className}`} 
            onSubmit={createTruck}
        >

            <label htmlFor='type'> Type: </label>
            <select 
                name='type'
                className='newtruck__types'
                onChange={handleTypeSelect}
            >
                <option 
                    className='newtruck__type'
                    value='stringer'
                > Stringer </option>
                
                <option 
                    className='newtruck__type'
                    value='smallStraight'
                > Small Straight </option>

                <option 
                    className='newtruck__type'
                    value='largeStraight'
                > Large Straight </option>

            </select>

            <label htmlFor='truckName'> Name: </label>
            <input 
                type='text'
                name='truckName'
                value={truckName}
                onChange={handleTruckNameInput}
                required 
            />
            
            <label htmlFor='brand'> Brand: </label>
            <input 
                type='text'
                name='brand'
                value={brand}
                onChange={handleBrandInput}
                required 
            />
            
            <label htmlFor='model'> Model: </label>
            <input 
                type='text'
                name='model'
                value={model}
                onChange={handleModelInput}
                required 
            />

            <button type='submit'> Create Truck </button>

        </form>
    );
}