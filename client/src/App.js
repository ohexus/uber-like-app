import React from 'react';
import Routes from './routes';
import { BrowserRouter } from 'react-router-dom';

import './App.scss';
import 'semantic-ui-css/semantic.min.css'

function App() {
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
