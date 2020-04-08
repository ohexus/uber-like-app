import React, { useState, useEffect, useRef, useContext } from 'react';
import './Map.scss';
import 'react-map-gl-geocoder/dist/mapbox-gl-geocoder.css';

import findUsersCoordinates from '../../helpers/findLocationInfo';

import { NavigationControl, Marker, Popup, InteractiveMap } from 'react-map-gl';
import Geocoder from 'react-map-gl-geocoder';

import SocketContext from '../../context/SocketContext';

import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;
const LOADS_API = `${API_URL}/api/load/allForUser`;
const UPDATELOADCOORDS_API = `${API_URL}/api/load/updateCoords`;
const CHECKFORLOAD_API = `${API_URL}/api/load/checkForLoad`;

const MAPBOX_TOKEN = 'pk.eyJ1IjoiZWFzeWJyZWV6ZSIsImEiOiJjazhqczkydmEwM3ByM3Jub2E5MjV3aWFyIn0.PZM-0d_B-QKbR4TxTRhvug';

export default function Map(props) {
  const socket = useContext(SocketContext);

  const [user] = useState(props.user);

  const [loadsNew, setLoadsNew] = useState(null);

  const [activeLoadIndex, setActiveLoadIndex] = useState(0);

  const [viewport, setViewport] = useState({
    width: '100%',
    height: 600,
    latitude: 0,
    longitude: 0,
    zoom: 8,
  });

  const [userLocation, setUserLocation] = useState(null);
  const [pickUpCoords, setPickUpCoords] = useState(null);
  const [pickUpAddress, setPickUpAddress] = useState(null);
  const [deliveryCoords, setDeliveryCoords] = useState(null);
  const [deliveryAddress, setDeliveryAddress] = useState(null);

  const [showPickUpCoords, setShowPickUpCoords] = useState(false);
  const [showDeliveryCoords, setShowDeliveryCoords] = useState(false);

  const [popupInfo, setPopupInfo] = useState(false);
  const [showPopupInfo, setShowPopupInfo] = useState(false);

  const mapRef = useRef();

  const getAddressFromCoords = async (lon, lat) => {
    const address = await axios.get(`http://api.mapbox.com/geocoding/v5/mapbox.places/${lon},${lat}.json?access_token=${MAPBOX_TOKEN}`)
      .then((res) => res.data.features[0].place_name);

    return address;
  };

  const updateLoadCoords = async (e) => {
    e.preventDefault();

    await axios.put(UPDATELOADCOORDS_API, {
      loadId: loadsNew[activeLoadIndex]._id,
      pickUpCoords,
      deliveryCoords,
      pickUpAddress,
      deliveryAddress,
    }, {
      headers: {
        authorization: localStorage.getItem('jwt_token'),
      },
    });

    alert('coordinates updated');
  };

  const onMarkerDragEnd = async (event, funcCoordSet, funcAddressSet) => {
    const lon = event.lngLat[0];
    const lat = event.lngLat[1];

    funcCoordSet({
      longitude: lon,
      latitude: lat,
    });

    funcAddressSet(await getAddressFromCoords(lon, lat));
  };

  const toggleShowLocationButton = async (show, showSet, funcCoordSet, funcAddressSet) => {
    const lon = viewport.longitude;
    const lat = viewport.latitude;

    funcAddressSet(await getAddressFromCoords(lon, lat));

    funcCoordSet({
      longitude: lon,
      latitude: lat,
    });
    showSet(!show);
  };

  const handleSelectChange = (e) => {
    setActiveLoadIndex(e.target.value);

    const pickUpLat = loadsNew[e.target.value].coord.pickUp.lat;
    const pickUpLon = loadsNew[e.target.value].coord.pickUp.lon;
    setPickUpCoords({
      latitude: pickUpLat !== null ? pickUpLat : viewport.latitude,
      longitude: pickUpLon !== null ? pickUpLon : viewport.longitude,
    });

    const deliveryLat = loadsNew[e.target.value].coord.delivery.lat;
    const deliveryLon = loadsNew[e.target.value].coord.delivery.lon;
    setDeliveryCoords({
      latitude: deliveryLat !== null ? deliveryLat : viewport.latitude,
      longitude: deliveryLon !== null ? deliveryLon : viewport.longitude,
    });

    setShowPickUpCoords(!!(pickUpLat && pickUpLon));
    setShowDeliveryCoords(!!(deliveryLat && deliveryLon));
  };

  const renderPopup = () => (showPopupInfo
    && <Popup tipSize={ 5 }
      anchor="bottom-right"
      longitude={ popupInfo.longitude }
      latitude={ popupInfo.latitude }
      closeButton={ false }
      className="popup"
    >
      <h3>{ popupInfo.title }</h3>
      <p>{ popupInfo.info }</p>
    </Popup>
  );

  const handleShowPopup = (title, coord, info) => {
    setPopupInfo({
      latitude: coord.latitude,
      longitude: coord.longitude,
      title,
      info,
    });
    setShowPopupInfo(true);
  };

  useEffect(() => {
    if (user.role === 'shipper') {
      if (!loadsNew) {
        const fetchLoads = async () => {
          const loads = await axios.get(LOADS_API, {
            headers: {
              authorization: localStorage.getItem('jwt_token'),
            },
          }).then((res) => res.data.loads);

          const filteredLoads = loads.filter((l) => l.status === 'NEW');

          if (filteredLoads.length) {
            setLoadsNew(filteredLoads);

            const load = filteredLoads[0];

            setPickUpCoords({
              latitude: load.coord.pickUp.lat || viewport.latitude,
              longitude: load.coord.pickUp.lon || viewport.longitude,
            });

            setDeliveryCoords({
              latitude: load.coord.delivery.lat || viewport.latitude,
              longitude: load.coord.delivery.lon || viewport.longitude,
            });

            setPickUpAddress(load.address.pickUp);
            setDeliveryAddress(load.address.delivery);

            setShowPickUpCoords(!!load.coord.pickUp.lat);
            setShowDeliveryCoords(!!load.coord.delivery.lat);
          }
        };

        fetchLoads();
      }
    }
  }, [user.role, loadsNew, viewport.latitude, viewport.longitude]);

  useEffect(() => {
    if (user.role === 'driver') {
      if (!loadsNew) {
        const fetchLoad = async () => {
          const resLoad = await axios.get(CHECKFORLOAD_API, {
            headers: {
              authorization: localStorage.getItem('jwt_token'),
            },
          }).then((res) => res.data);

          if (resLoad.status !== 'OK') return;

          const load = resLoad.load;

          setPickUpCoords({
            latitude: load.coord.pickUp.lat,
            longitude: load.coord.pickUp.lon,
          });

          setDeliveryCoords({
            latitude: load.coord.delivery.lat,
            longitude: load.coord.delivery.lon,
          });

          setPickUpAddress(load.address.pickUp);
          setDeliveryAddress(load.address.delivery);

          setShowPickUpCoords(true);
          setShowDeliveryCoords(true);
        };

        fetchLoad();
      }
    }
  }, [user.role, loadsNew]);

  useEffect(() => {
    let isExist = true;

    const handleUserLocation = (position) => {
      if (isExist) {
        setUserLocation(position.coords);
      }
    };

    const interval = setInterval(() => {
      findUsersCoordinates(handleUserLocation);
    }, 5000);

    return () => {
      clearInterval(interval);
      isExist = false;
    };
  }, []);

  useEffect(() => {
    if (userLocation) {
      if (!viewport.latitude || !viewport.longitude) {
        setViewport({
          ...viewport,
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
        });
      }
    }
  }, [viewport, userLocation]);

  useEffect(() => {
    if (loadsNew) {
      socket.on('createLoad', (newLoad) => {
        setLoadsNew([...loadsNew, newLoad]);
      });

      socket.on('deleteLoad', (deletedLoad) => {
        setLoadsNew(loadsNew.filter((load) =>
          load._id !== deletedLoad._id));

        setPickUpAddress(null);
        setDeliveryAddress(null);

        setShowPickUpCoords(false);
        setShowDeliveryCoords(false);
      });
    } else {
      socket.on('createLoad', (newLoad) => {
        setLoadsNew([newLoad]);
      });
    }
  }, [socket, loadsNew]);

  useEffect(() => {
    let isExist = true;

    if (isExist) {
      socket.on('checkForLoad', (load) => {
        setPickUpCoords({
          latitude: load.coord.pickUp.lat,
          longitude: load.coord.pickUp.lon,
        });

        setDeliveryCoords({
          latitude: load.coord.delivery.lat,
          longitude: load.coord.delivery.lon,
        });

        setPickUpAddress(load.address.pickUp);
        setDeliveryAddress(load.address.delivery);

        setShowPickUpCoords(true);
        setShowDeliveryCoords(true);
      });
    }

    return () => isExist = false;
  }, [socket]);

  // TODO window resize

  return (<>
    { userLocation
      ? <InteractiveMap
        { ...viewport }
        onViewportChange={ setViewport }
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxApiAccessToken={ MAPBOX_TOKEN }
        ref={ mapRef }
      >
        { renderPopup() }
        <Marker
          className="custom-marker"
          longitude={ userLocation.longitude }
          latitude={ userLocation.latitude }
        >
          <div
            className={ `custom-marker__icon custom-marker__icon custom-marker__icon${user.role === 'driver' ? '--driver' : '--shipper'}` }
            alt=""
          />
        </Marker>

        { showPickUpCoords && <Marker
          className="custom-marker"
          longitude={ pickUpCoords.longitude }
          latitude={ pickUpCoords.latitude }
          draggable={ user.role === 'shipper' ? true : false }
          onDragEnd={ (event) => onMarkerDragEnd(event, setPickUpCoords, setPickUpAddress) }
        >
          <div
            className="custom-marker__icon custom-marker__icon--pick-up"
            alt=""
            onMouseEnter={ () =>
              handleShowPopup('Pick Up Address:', pickUpCoords, pickUpAddress)
            }
            onMouseLeave={ () => setShowPopupInfo(false) }
          />
        </Marker> }

        { showDeliveryCoords && <Marker
          className="custom-marker"
          longitude={ deliveryCoords.longitude }
          latitude={ deliveryCoords.latitude }
          draggable={ user.role === 'shipper' ? true : false }
          onDragEnd={ (event) =>
            onMarkerDragEnd(event, setDeliveryCoords, setDeliveryAddress)
          }
        >
          <div
            className="custom-marker__icon custom-marker__icon--delivery"
            alt=""
            onMouseEnter={ () =>
              handleShowPopup('Delivery Address:', deliveryCoords, deliveryAddress)
            }
            onMouseLeave={ () => setShowPopupInfo(false) }
          />
        </Marker> }

        <div className="nav">
          <NavigationControl
            onViewportChange={ setViewport }
            showCompass={ false }
          />
        </div>

        { user.role === 'shipper' && <form onSubmit={ updateLoadCoords } className="pad">
          <button
            type="button"
            onClick={ () =>
              toggleShowLocationButton(showPickUpCoords, setShowPickUpCoords, setPickUpCoords, setPickUpAddress)
            }
          >
            { showPickUpCoords
              ? 'Delete Pick Up Mark'
              : 'Set Pick Up Mark' }
          </button>

          <button
            type="button"
            onClick={ () =>
              toggleShowLocationButton(showDeliveryCoords, setShowDeliveryCoords, setDeliveryCoords, setDeliveryAddress)
            }
          >
            { showDeliveryCoords
              ? 'Delete Delivery Mark'
              : 'Set Delivery Mark' }
          </button>

          <select onChange={ handleSelectChange }>
            <option disabled value={ null }>
              { loadsNew ? 'New loads' : 'Create new load first' }
            </option>

            { loadsNew && loadsNew.map((load, index) => (<option
              key={ index }
              value={ index }
            >{ load.loadName }</option>)) }
          </select>

          <button
            type="submit"
            disabled={ !((loadsNew && showPickUpCoords && showDeliveryCoords)) }
          >Update Coordinates</button>

        </form> }

        <Geocoder
          mapRef={ mapRef }
          onViewportChange={ setViewport }
          mapboxApiAccessToken={ MAPBOX_TOKEN }
        />

      </InteractiveMap>
      : 'Map is loading...'
    }
  </>);
}
