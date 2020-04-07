import React, { useState, useEffect, useRef } from 'react';
import './Map.scss';
import 'react-map-gl-geocoder/dist/mapbox-gl-geocoder.css';

import findUsersCoordinates from '../../helpers/findLocationInfo';

import { NavigationControl, Marker, Popup, InteractiveMap } from 'react-map-gl';
import Geocoder from 'react-map-gl-geocoder';

import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;
const LOADS_API = `${API_URL}/api/load/allForUser`;
const UPDATELOADCOORDS_API = `${API_URL}/api/load/updateCoords`;
const CHECKFORLOAD_API = `${API_URL}/api/load/checkForLoad`;

const MAPBOX_TOKEN = 'pk.eyJ1IjoiZWFzeWJyZWV6ZSIsImEiOiJjazhqczkydmEwM3ByM3Jub2E5MjV3aWFyIn0.PZM-0d_B-QKbR4TxTRhvug';

export default function Map(props) {
  const [user] = useState(props.user);

  const [loadsData, setLoadsData] = useState(null);

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

  const [reloadPage, setReloadPage] = useState(false);

  const mapRef = useRef();

  const getAddressFromCoords = async (lon, lat) => {
    const address = await axios.get(`http://api.mapbox.com/geocoding/v5/mapbox.places/${lon},${lat}.json?access_token=${MAPBOX_TOKEN}`)
      .then((res) => res.data.features[0].place_name);

    return address;
  };

  const updateLoadCoords = async (e) => {
    e.preventDefault();

    await axios.put(UPDATELOADCOORDS_API, {
      loadId: loadsData[activeLoadIndex]._id,
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
    setReloadPage(true);
  };

  const onMarkerDragEnd = async (event, funcCoordSet, funcAddressSet) => {
    const lon = event.lngLat[0];
    const lat = event.lngLat[1];

    funcAddressSet(await getAddressFromCoords(lon, lat));

    funcCoordSet({
      longitude: lon,
      latitude: lat,
    });
  };

  const toggleShowLocationButton = (show, showSet, locationSet) => {
    locationSet({
      latitude: viewport.latitude,
      longitude: viewport.longitude,
    });
    showSet(!show);
  };

  const handleSelectChange = (e) => {
    setActiveLoadIndex(e.target.value);

    const pickUpLat = loadsData[e.target.value].coord.pickUp.lat;
    const pickUpLon = loadsData[e.target.value].coord.pickUp.lon;
    setPickUpCoords({
      latitude: pickUpLat !== null ? pickUpLat : viewport.latitude,
      longitude: pickUpLon !== null ? pickUpLon : viewport.longitude,
    });

    const deliveryLat = loadsData[e.target.value].coord.delivery.lat;
    const deliveryLon = loadsData[e.target.value].coord.delivery.lon;
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
      const fetchLoads = async () => {
        const loads = await axios.get(LOADS_API, {
          headers: {
            authorization: localStorage.getItem('jwt_token'),
          },
        }).then((res) => res.data);

        const filteredLoads = loads.filter((l) => l.status === 'NEW');

        if (filteredLoads.length) {
          setLoadsData(filteredLoads);

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
  }, [user.role, viewport.latitude, viewport.longitude]);

  useEffect(() => {
    if (user.role === 'driver') {
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
  }, [user.role]);

  useEffect(() => {
    const handleUserLocation = (position) => {
      setViewport({
        ...viewport,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
      setUserLocation(position.coords);
    };

    findUsersCoordinates(handleUserLocation);
  }, [viewport]);

  if (reloadPage) {
    window.location.reload();
  }

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
          draggable
          onDragEnd={ (event) => onMarkerDragEnd(event, setPickUpCoords, setPickUpAddress) }
        >
          <div
            className="custom-marker__icon custom-marker__icon--pick-up"
            alt=""
            onMouseEnter={ () => handleShowPopup('Pick Up Address:', pickUpCoords, pickUpAddress) }
            onMouseLeave={ () => setShowPopupInfo(false) }
          />
        </Marker> }

        { showDeliveryCoords && <Marker
          className="custom-marker"
          longitude={ deliveryCoords.longitude }
          latitude={ deliveryCoords.latitude }
          draggable
          onDragEnd={ (event) => onMarkerDragEnd(event, setDeliveryCoords, setDeliveryAddress) }
        >
          <div
            className="custom-marker__icon custom-marker__icon--delivery"
            alt=""
            onMouseEnter={ () => handleShowPopup('Delivery Address:', deliveryCoords, deliveryAddress) }
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
            onClick={ () => toggleShowLocationButton(showPickUpCoords, setShowPickUpCoords, setPickUpCoords) }
          > { showPickUpCoords ? 'Delete Pick Up Mark' : 'Set Pick Up Mark' } </button>
          <button
            type="button"
            onClick={ () => toggleShowLocationButton(showDeliveryCoords, setShowDeliveryCoords, setDeliveryCoords) }
          > { showDeliveryCoords ? 'Delete Delivery Mark' : 'Set Delivery Mark' } </button>
          <select onChange={ handleSelectChange }>
            <option disabled value={ null }> { loadsData ? 'select load' : 'create new load first' }</option>
            { loadsData && loadsData.map((load, index) => (<option
              key={ index }
              value={ index }
            >{ load.loadName }</option>)) }
          </select>
          <button
            type="submit"
            disabled={ !((loadsData && showPickUpCoords && showDeliveryCoords)) }
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
