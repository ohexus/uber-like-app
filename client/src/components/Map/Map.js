import React, { useState, useEffect, useRef } from 'react';
import './Map.scss';
import 'react-map-gl-geocoder/dist/mapbox-gl-geocoder.css'

import findUsersCoordinates from '../../helpers/findLocationInfo';

import { NavigationControl, Marker, Popup, InteractiveMap } from 'react-map-gl';
import Geocoder from 'react-map-gl-geocoder'

import { Icon } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css'

const MAPBOX_TOKEN = 'pk.eyJ1IjoiZWFzeWJyZWV6ZSIsImEiOiJjazhqczkydmEwM3ByM3Jub2E5MjV3aWFyIn0.PZM-0d_B-QKbR4TxTRhvug';

export default function Map(props) {
  const [role] = useState(props.role)

  const [viewport, setViewport] = useState({
    width: '100%',
    height: 400,
    latitude: 50.874331,
    longitude: 34.7075792,
    zoom: 8
  });
  const [userLocation, setUserLocation] = useState(null);
  const [pickUpLocation, setPickUpLocation] = useState(null);
  const [deliveryLocation, setDeliveryLocation] = useState(null);

  const [showPopupInfo, setShowPopupInfo] = useState(false);

  const mapRef = useRef()

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

  const handlePickUpLocation = () => {
    setPickUpLocation({
      longitude: viewport.longitude,
      latitude: viewport.latitude
    });
  }

  const handleDeliveryLocation = () => {
    setDeliveryLocation({
      longitude: viewport.longitude,
      latitude: viewport.latitude
    });
  }

  const deletePickUpLocation = () => {
    setPickUpLocation(null);
  }

  const deleteDeliveryLocation = () => {
    setDeliveryLocation(null);
  }

  const handleUserLocation = (position) => {
    setUserLocation(position.coords);
  }

  useEffect(() => {
    findUsersCoordinates(handleUserLocation)
  }, []);

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
          longitude={userLocation.longitude}
          latitude={userLocation.latitude}
        >
          <Icon
            name={role === 'driver' ? 'car' : 'user'}
            size='large'
          // onMouseEnter={() => setShowPopupInfo(true)}
          // onMouseLeave={() => setShowPopupInfo(false)}
          />
        </Marker>

        {pickUpLocation && <Marker
          longitude={pickUpLocation.longitude}
          latitude={pickUpLocation.latitude}
        >
          <Icon
            name='point'
            size='large'
          // onMouseEnter={() => setShowPopupInfo(true)}
          // onMouseLeave={() => setShowPopupInfo(false)}
          />
        </Marker>}

        {deliveryLocation && <Marker
          longitude={deliveryLocation.longitude}
          latitude={deliveryLocation.latitude}
        >
          <Icon
            name='point'
            size='large'
          // onMouseEnter={() => setShowPopupInfo(true)}
          // onMouseLeave={() => setShowPopupInfo(false)}
          />
        </Marker>}

        <div className='nav'>
          <NavigationControl
            onViewportChange={setViewport}
            showCompass={false}
          />
        </div>

        <div className='pad'>
          {pickUpLocation
            ? <button type='button' onClick={deletePickUpLocation}>delete pick up</button>
            : <button type='button' onClick={handlePickUpLocation}>set pick up</button>
          }
          {deliveryLocation
            ? <button type='button' onClick={deleteDeliveryLocation}>delete delivery</button>
            : <button type='button' onClick={handleDeliveryLocation}>set delivery</button>
          }
        </div>

        <Geocoder
          mapRef={mapRef}
          onViewportChange={setViewport}
          mapboxApiAccessToken={MAPBOX_TOKEN}
        />

      </InteractiveMap>
      : 'Map loading'
    }
  </>);
}