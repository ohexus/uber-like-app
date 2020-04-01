import React from 'react';
import Routes from './routes';
import { BrowserRouter } from 'react-router-dom';

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
