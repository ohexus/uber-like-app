import React, { useEffect } from 'react';
import Routes from './routes';
import { BrowserRouter } from 'react-router-dom';

import io from 'socket.io-client';

import './App.scss';
import 'semantic-ui-css/semantic.min.css';

const SERVER_URL = process.env.REACT_APP_API_URL;
const socket = io(SERVER_URL);

function App() {
  useEffect(() => {
    socket.on('connect', () => {
      console.log('socket connected');
    });
  }, []);

  return (
    <BrowserRouter>
      <div className="App">
        <h1> Easy Breeze </h1>
        <Routes />
      </div>
    </BrowserRouter>
  );
}

export default App;
