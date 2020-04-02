import React, { useState, useEffect, useCallback } from 'react';
import './WeatherPanel.scss';

import InfoTile from '../InfoTile/InfoTile';
import windArrow from '../../assets/images/wind-arrow.png';

import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;
const WEATHER_API = `${API_URL}/api/weather/`;

// Open Weather Map Response
// {                                                                                
//     coord: { lon: 34.71, lat: 50.87 },                                             
//     weather: [{ 
//          id: 800, 
//          main: 'Clear', 
//          description: 'clear sky', 
//          icon: '01n' 
//     }],
//     base: 'stations',                                                              
//     main: {                                                                        
//         temp: -0.09,                                                                 
//         feels_like: -5.37,                                                           
//         temp_min: -0.09,                                                             
//         temp_max: -0.09,                                                             
//         pressure: 1014,                                                              
//         humidity: 84,                                                                
//         sea_level: 1014,                                                             
//         grnd_level: 992                                                              
//     },                                                                             
//     wind: { speed: 4.23, deg: 244 },                                               
//     clouds: { all: 9 },                                                            
//     dt: 1585787093,                                                                
//     sys: { country: 'UA', sunrise: 1585797248, sunset: 1585844090 },               
//     timezone: 10800,                                                               
//     id: 692194,                                                                    
//     name: 'Sumy',                                                                  
//     cod: 200                                                                       
// }                                                                                

export default function WeatherPanel() {
    const [coordinates, setCoordinates] = useState(null);
    const [weatherInfo, setWeatherInfo] = useState(null);
    const [weatherMainInfo, setWeatherMainInfo] = useState(null);
    const [windInfo, setWindInfo] = useState(null);
    const [showWeather, setShowWeather] = useState(false);

    const fetchWeather = useCallback(async() => {
        const weatherRes = await axios.post(WEATHER_API, {
            lat: coordinates.latitude,
            lon: coordinates.longitude
        }).then(res => res.data);
    
        if (weatherRes) {
            setWeatherInfo(weatherRes.weather[0]);
            setWeatherMainInfo(weatherRes.main);
            setWindInfo(weatherRes.wind);

            setShowWeather(true);
        }
    }, [coordinates, setWeatherInfo])

    const displayLocationInfo = useCallback((position) => {
        const coords = position.coords;
        
        setCoordinates(coords);
    }, [])

    useEffect(() => {
        if (!coordinates) {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(displayLocationInfo);
            }
        }
    }, [coordinates, displayLocationInfo]);

    useEffect(() => {
        if (!showWeather && coordinates) {
            (async() => await fetchWeather())();
        }
    }, [showWeather, coordinates, fetchWeather]);

    return (
        <div className='weather'>
            {showWeather 
                ? <>
                    <div className='weather__info'>
                        <img
                            className='weather__icon'
                            src={`http://openweathermap.org/img/wn/${weatherInfo.icon}@2x.png`}     
                        />

                        <h3> {weatherInfo.description} </h3>
                    </div>

                    <div className='weather__temperature'>
                        <h2 className='weather__temperature-number'>
                            {parseInt(weatherMainInfo.temp)} °C
                        </h2>

                        <InfoTile 
                            label='Feels like:'
                            info={parseInt(weatherMainInfo.feels_like)}
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
                        
                        <img 
                            className='weather__wind-arrow'
                            src={windArrow}
                            style={{
                                transform: `rotate(${windInfo.deg}deg)`
                            }}
                        />
                    </div>
                </>
                : <p> Can't get weather info, please try again later </p>
            }
        </div>
    );
}