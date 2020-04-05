import React, { useState, useEffect, useRef, useCallback } from 'react';
import './Map.scss';
import 'react-map-gl-geocoder/dist/mapbox-gl-geocoder.css'

import findUsersCoordinates from '../../helpers/findLocationInfo';

import { NavigationControl, Marker, Popup, InteractiveMap } from 'react-map-gl';
import Geocoder from 'react-map-gl-geocoder'

import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;
const LOADS_API = `${API_URL}/api/load/allForUser`;
const UPDATELOADCOORDS_API = `${API_URL}/api/load/updateCoords`;
const CHECKFORLOAD_API = `${API_URL}/api/load/checkForLoad`;

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
  const [user] = useState(props.user);

  const [loadsData, setLoadsData] = useState(null);

  const [activeLoadIndex, setActiveLoadIndex] = useState(0);

  const [viewport, setViewport] = useState({
    width: '100%',
    height: 600,
    latitude: 0,
    longitude: 0,
    zoom: 8
  });

  const [userLocation, setUserLocation] = useState(null);
  const [pickUpLocation, setPickUpLocation] = useState(null);
  const [deliveryLocation, setDeliveryLocation] = useState(null);

  const [showPickUpLocation, setShowPickUpLocation] = useState(false);
  const [showDeliveryLocation, setShowDeliveryLocation] = useState(false);
  // const [showPopupInfo, setShowPopupInfo] = useState(false);

  const mapRef = useRef();

  const fetchLoads = async () => {
    const loads = await axios.get(LOADS_API, {
      headers: {
        'authorization': localStorage.getItem('jwt_token')
      }
    });

    return loads.data;
  }

  const fetchLoad = async () => {
    const load = await axios.get(CHECKFORLOAD_API, {
      headers: {
        'authorization': localStorage.getItem('jwt_token')
      }
    }).then(res => res.data);

    return ((load.status !== 'Nothing' && load.status !== 'No truck assigned') ? load : null)
  }

  const updateLoadCoords = async (e) => {
    await axios.put(UPDATELOADCOORDS_API, {
      loadId: loadsData[activeLoadIndex]._id,
      pickUpCoords: pickUpLocation,
      deliveryCoords: deliveryLocation
    }, {
      headers: {
        'authorization': localStorage.getItem('jwt_token')
      }
    });

    alert('coordinates updated');
  }

  const onMarkerDragEnd = (event, funcSet) => {
    funcSet({
      longitude: event.lngLat[0],
      latitude: event.lngLat[1]
    });
    console.log(event.lngLat)
  };

  const toggleShowLocationButton = (show, showSet, locationSet) => {
    locationSet({
      latitude: viewport.latitude,
      longitude: viewport.longitude
    });
    showSet(!show);
  }

  const handleSelectChange = (e) => {
    setActiveLoadIndex(e.target.value);

    const pickUpLat = loadsData[e.target.value].coord.pickUp.lat;
    const pickUpLon = loadsData[e.target.value].coord.pickUp.lon;
    setPickUpLocation({
      latitude: pickUpLat !== null ? pickUpLat : viewport.latitude,
      longitude: pickUpLon !== null ? pickUpLon : viewport.longitude
    });

    const deliveryLat = loadsData[e.target.value].coord.delivery.lat;
    const deliveryLon = loadsData[e.target.value].coord.delivery.lon;
    setDeliveryLocation({
      latitude: deliveryLat !== null ? deliveryLat : viewport.latitude,
      longitude: deliveryLon !== null ? deliveryLon : viewport.longitude
    });

    setShowPickUpLocation(true);
    setShowDeliveryLocation(true);
  }

  const handleUserLocation = useCallback((position) => {
    setViewport({
      ...viewport,
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    })
    setUserLocation(position.coords);
  }, [viewport])

  useEffect(() => {
    findUsersCoordinates(handleUserLocation)
  }, [handleUserLocation]);

  useEffect(() => {
    (async () => {
      if (user.role === 'shipper') {
        if (!pickUpLocation && !deliveryLocation) {
          const loads = await fetchLoads();
          const filteredLoads = loads.filter(l => l.status === 'NEW')

          if (filteredLoads.length) {
            setLoadsData(filteredLoads);

            setPickUpLocation({
              latitude: filteredLoads[0].coord.pickUp.lat || viewport.latitude,
              longitude: filteredLoads[0].coord.pickUp.lon || viewport.longitude
            });

            setDeliveryLocation({
              latitude: filteredLoads[0].coord.delivery.lat || viewport.latitude,
              longitude: filteredLoads[0].coord.delivery.lon || viewport.longitude
            });

            setShowPickUpLocation(filteredLoads[0].coord.pickUp.lat ? true : false);
            setShowDeliveryLocation(filteredLoads[0].coord.delivery.lat ? true : false);
          }
        }
      } else {
        const load = await fetchLoad();

        if (load) {
          setPickUpLocation({
            latitude: load.coord.pickUp.lat,
            longitude: load.coord.pickUp.lon
          });

          setDeliveryLocation({
            latitude: load.coord.delivery.lat,
            longitude: load.coord.delivery.lon
          });

          setShowPickUpLocation(true);
          setShowDeliveryLocation(true);
        }
      }
    })();
  }, [user, viewport.latitude, viewport.longitude, pickUpLocation, deliveryLocation]);

  // TODO window resize

  return (<>
    {userLocation
      ? <InteractiveMap
        {...viewport}
        onViewportChange={setViewport}
        mapStyle='mapbox://styles/mapbox/streets-v11'
        mapboxApiAccessToken={MAPBOX_TOKEN}
        ref={mapRef}
      >
        <Marker
          className='custom-marker'
          longitude={userLocation.longitude}
          latitude={userLocation.latitude}
        >
          <div
            className={`custom-marker__icon custom-marker__icon custom-marker__icon${user.role === 'driver' ? '--driver' : '--shipper'}`}
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

        {user.role === 'shipper' && <form onSubmit={updateLoadCoords} className='pad'>
          <button
            type='button'
            onClick={() => toggleShowLocationButton(showPickUpLocation, setShowPickUpLocation, setPickUpLocation)}
          > {showPickUpLocation ? 'Delete Pick Up Mark' : 'Set Pick Up Mark'} </button>
          <button
            type='button'
            onClick={() => toggleShowLocationButton(showDeliveryLocation, setShowDeliveryLocation, setDeliveryLocation)}
          > {showDeliveryLocation ? 'Delete Delivery Mark' : 'Set Delivery Mark'} </button>
          <select onChange={handleSelectChange}>
            <option disabled value={null}> {loadsData ? 'select load' : 'create new load first'}</option>
            {loadsData && loadsData.map((load, index) => {
              return <option
                key={index}
                value={index}
              >{load.name}</option>
            })}
          </select>
          <button
            type='submit'
            disabled={(loadsData && showPickUpLocation && showDeliveryLocation) ? false : true}
          >Update Coordinates</button>
        </form>}

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