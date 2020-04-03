import React, { useState, useEffect } from 'react';
import './Map.scss';

import findUsersCoordinates from '../../helpers/findLocationInfo';

import MapGL, { NavigationControl, Marker, Popup } from 'react-map-gl';

import { Icon } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css'

const MAPBOX_TOKEN = 'pk.eyJ1IjoiZWFzeWJyZWV6ZSIsImEiOiJjazhqczkydmEwM3ByM3Jub2E5MjV3aWFyIn0.PZM-0d_B-QKbR4TxTRhvug';

const navStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    padding: '10px'
};

export default function Map() {
    const [viewport, setViewport] = useState({
        width: '100%',
        height: 400,
        latitude: 50.874331,
        longitude: 34.7075792,
        zoom: 8
    });
    const [userLocation, setUserLocation] = useState(null);

    const [showPopupInfo, setShowPopupInfo] = useState(false);

    const markerList=[{
        lat: 50.89019028366696,
        lon: 34.74944010659044,
        name: 'Pick-up address',
        info: 'Pick-up here'
    }, {
        lat: 50.91368095582415,
        lon: 34.81511865056995,
        name: 'Delivery address',
        info: 'Delivery here'
    }];

    const renderPopup = (index) => {
        return (showPopupInfo && 
            <Popup tipSize={5}
                anchor='bottom-right'
                longitude={markerList[index].lon}
                latitude={markerList[index].lat}
                onMouseLeave={() => setShowPopupInfo(false)}
                closeOnClick={true}
            >
                <p>
                    <strong>{markerList[index].name}</strong>
                    <br/>
                    {markerList[index].info}
                </p>
            </Popup>
        );
    }

    const handleUserLocation = (position) => {
        setUserLocation(position.coords);
    }

    useEffect(() => {
        findUsersCoordinates(handleUserLocation)
    }, []);

    return (<>
        {userLocation
            ? <MapGL
                {...viewport}
                onViewportChange={setViewport}
                mapStyle='mapbox://styles/mapbox/streets-v11'
                mapboxApiAccessToken={MAPBOX_TOKEN}
            >
                {markerList.map((marker, index) => {
                    return (
                        <div key={index}>
                            <Marker 
                                longitude={marker.lon}
                                latitude={marker.lat}
                            >
                                <Icon 
                                    name='point'
                                    size='large'
                                    onMouseEnter={() => setShowPopupInfo(true)}
                                    onMouseLeave={() => setShowPopupInfo(false)}
                                />
                            </Marker>
                            {renderPopup(index)}
                        </div>
                    );
                })}

                <div className='nav' style={navStyle}>
                    <NavigationControl 
                        onViewportChange={setViewport}
                        showCompass={false}
                    />
                </div>
            </MapGL>
            : 'Map loading'
        }
    </>);
}