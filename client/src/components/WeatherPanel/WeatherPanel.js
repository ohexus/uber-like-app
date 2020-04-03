import React, { useState, useEffect, useCallback } from 'react';
import './WeatherPanel.scss';

import findUsersCoordinates from '../../helpers/findLocationInfo';

import InfoTile from '../InfoTile/InfoTile';
import windArrow from '../../assets/images/wind-arrow.png';

import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;
const WEATHER_API = `${API_URL}/api/weather/update`;

// Weather Schema
// created_by: {type: Types.ObjectId, ref: 'User'}
// weather: {
//     main: String,
//     description: String,
//     icon: String
// },
// main: {                                                     
//     temp: Number,                                                                 
//     feels_like: Number,   
//     pressure: Number,
//     humidity: Number
// },
// wind: {
//     speed: Number,
//     deg: Number
// }

function WeatherTempString(props) {
    return (
        `${parseInt(props.temp)} °C`
    );
}

export default function WeatherPanel() {
    const [userLocation, setUserLocation] = useState(null);
    const [weatherInfo, setWeatherInfo] = useState(null);
    const [weatherMainInfo, setWeatherMainInfo] = useState(null);
    const [windInfo, setWindInfo] = useState(null);

    const [showWeather, setShowWeather] = useState(false);

    const fetchWeather = useCallback(async () => {
        const weatherData = await axios.post(WEATHER_API, {
            lat: userLocation.latitude,
            lon: userLocation.longitude
        }, {
            headers: {
                'authorization': localStorage.getItem('jwt_token')
            }
        }).then(res => res.data);

        if (weatherData) {
            setWeatherInfo(weatherData.weather);
            setWeatherMainInfo(weatherData.main);
            setWindInfo(weatherData.wind);

            setShowWeather(true);
        }
    }, [userLocation, setWeatherInfo])

    const handleUserLocation = (position) => {
        setUserLocation(position.coords);
    }

    useEffect(() => {
        findUsersCoordinates(handleUserLocation)
    }, []);

    useEffect(() => {
        if (!showWeather && userLocation) {
            (async () => await fetchWeather())();
        }
    }, [showWeather, userLocation, fetchWeather]);

    return (
        <div className='weather'>
            <h1> Weather for now: </h1>
            {showWeather && <>
                <div className='weather__info'>
                    <h2 className='weather__city'>
                        {weatherMainInfo.city}
                    </h2>

                    <img
                        className='weather__icon'
                        src={weatherInfo.iconUrl}
                        alt={weatherInfo.main}
                    />

                    <h3> {weatherInfo.description} </h3>
                </div>

                <div className='weather__temperature'>
                    <h2 className='weather__temperature-number'>
                        <WeatherTempString temp={weatherMainInfo.temp} />
                    </h2>

                    <InfoTile
                        label='Feels like:'
                        info={<WeatherTempString temp={weatherMainInfo.feels_like} />}
                    />
                </div>

                <InfoTile
                    label='Humidity:'
                    info={weatherMainInfo.humidity}
                />

                <InfoTile
                    label='Pressure:'
                    info={weatherMainInfo.pressure}
                />

                <div className='weather__wind'>
                    <InfoTile
                        label='Wind:'
                        info={`${windInfo.speed} km / h`}
                    />

                    <div className='weather__wind-arrow-wrapper'>
                        <img
                            className='weather__wind-arrow'
                            src={windArrow}
                            style={{
                                transform: `rotate(${windInfo.deg}deg)`
                            }}
                            alt='wind direction'
                        />
                    </div>
                </div>
            </>}
        </div>
    );
}