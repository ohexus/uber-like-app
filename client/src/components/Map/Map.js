import React, { useState, useEffect, useRef, useCallback } from 'react';
import './Map.scss';
import 'react-map-gl-geocoder/dist/mapbox-gl-geocoder.css'

import findUsersCoordinates from '../../helpers/findLocationInfo';

import { NavigationControl, Marker, Popup, InteractiveMap } from 'react-map-gl';
import Geocoder from 'react-map-gl-geocoder'

const MAPBOX_TOKEN = 'pk.eyJ1IjoiZWFzeWJyZWV6ZSIsImEiOiJjazhqczkydmEwM3ByM3Jub2E5MjV3aWFyIn0.PZM-0d_B-QKbR4TxTRhvug';

  // const renderPopup = (index) => {
  //   return (showPopupInfo &&
  //     <Popup tipSize={5}
  //       anchor='bottom-right'
  //       longitude={markerList[index].lon}
  //       latitude={markerList[index].lat}
  //       onMouseLeave={() => setShowPopupInfo(false)}
  //       closeOnClick={true}
  //     >
  //       <p>
  //         <strong>{markerList[index].name}</strong>
  //         <br />
  //         {markerList[index].info}
  //       </p>
  //     </Popup>
  //   );
  // }

export default function Map(props) {
  const [role] = useState(props.role)

  const [viewport, setViewport] = useState({
    width: '100%',
    height: 400,
    latitude: 0,
    longitude: 0,
    zoom: 8
  });
  const [events, setEvents] = useState({});

  const [userLocation, setUserLocation] = useState(null);
  const [pickUpLocation, setPickUpLocation] = useState({
    latitude: 0,
    longitude: 0
  });
  const [deliveryLocation, setDeliveryLocation] = useState({
    latitude: 0,
    longitude: 0
  });

  const [showPickUpLocation, setShowPickUpLocation] = useState(false);
  const [showDeliveryLocation, setShowDeliveryLocation] = useState(false);
  const [showPopupInfo, setShowPopupInfo] = useState(false);

  const mapRef = useRef();

  const onMarkerDragEnd = (event, funcSet) => {
    funcSet({
      longitude: event.lngLat[0],
      latitude: event.lngLat[1]
    });
    console.log(event.lngLat)
  };

  const handleUserLocation = useCallback((position) => {
    setViewport({
      ...viewport,
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    })
    setUserLocation(position.coords);
    setPickUpLocation(position.coords);
    setDeliveryLocation(position.coords);
  }, [viewport])

  useEffect(() => {
    findUsersCoordinates(handleUserLocation)
  }, [handleUserLocation]);

  return (<>
    {userLocation
      ? <InteractiveMap
        {...viewport}
        onViewportChange={setViewport}
        mapStyle='mapbox://styles/mapbox/streets-v11'
        mapboxApiAccessToken={MAPBOX_TOKEN}
        onClick={(e) => {
          let [longitude, latitude] = e.lngLat;
          console.log(longitude);
          console.log(latitude);
        }}
        ref={mapRef}
      >
        <Marker
          className='custom-marker'
          longitude={userLocation.longitude}
          latitude={userLocation.latitude}
        >
          <div
            className={`custom-marker__icon custom-marker__icon custom-marker__icon${ role === 'driver' ? '--driver' : '--shipper'}`}
            alt=''
          // onMouseEnter={() => setShowPopupInfo(true)}
          // onMouseLeave={() => setShowPopupInfo(false)}
          ></div>
        </Marker>

        {showPickUpLocation && <Marker
          className='custom-marker'
          longitude={pickUpLocation.longitude}
          latitude={pickUpLocation.latitude}
          draggable
          onDragEnd={(event) => onMarkerDragEnd(event, setPickUpLocation)}
        >
          <div
            className='custom-marker__icon custom-marker__icon--pick-up'
            alt=''
          ></div>
        </Marker>}
        
        {showDeliveryLocation && <Marker
          className='custom-marker'
          longitude={deliveryLocation.longitude}
          latitude={deliveryLocation.latitude}
          draggable
          onDragEnd={(event) => onMarkerDragEnd(event, setDeliveryLocation)}
        >
          <div
            className='custom-marker__icon custom-marker__icon--delivery'
            alt=''
          ></div>
        </Marker>}

        <div className='nav'>
          <NavigationControl
            onViewportChange={setViewport}
            showCompass={false}
          />
        </div>

        <div className='pad'>
          <button type='button' onClick={() => setShowPickUpLocation(!showPickUpLocation)}>
            {showPickUpLocation ? 'Delete Pick Up Mark' : 'Set Pick Up Mark'}
          </button>
          <button type='button' onClick={() => setShowDeliveryLocation(!showDeliveryLocation)}>
            {showDeliveryLocation ? 'Delete Delivery Mark' : 'Set Delivery Mark'}
          </button>
        </div>

        <Geocoder
          mapRef={mapRef}
          onViewportChange={setViewport}
          mapboxApiAccessToken={MAPBOX_TOKEN}
        />

      </InteractiveMap>
      : 'Map is loading...'
    }
  </>);
}