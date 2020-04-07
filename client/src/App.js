import React from 'react';
import Routes from './routes';
import { BrowserRouter } from 'react-router-dom';

import './App.scss';
import 'semantic-ui-css/semantic.min.css';

import SocketContext from './context/SocketContext';

import io from 'socket.io-client';
const socket = io(process.env.REACT_APP_API_URL, {
  transportOptions: {
    polling: {
      extraHeaders: {
        authorization: localStorage.getItem('jwt_token'),
      },
    },
  },
});

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <h1> Easy Breeze </h1>
        <SocketContext.Provider value={ socket }>
          <Routes />
        </SocketContext.Provider>
      </div>
    </BrowserRouter>
  );
}

export default App;
