import React from 'react';
import {Switch, Route} from 'react-router-dom';

import MainPage from './pages/MainPage/MainPage';
import UserPage from './pages/UserPage/UserPage';
import Login from './components/Login/Login';
import Signup from './components/Signup/Signup';

const Routes = () => (
    <Switch>
        <Route exact path='/' component={MainPage} />
        <Route exact path='/user' component={UserPage} />
        <Route exact path='/signup' component={Signup} />
        <Route exact path='/login' component={Login} />
    </Switch>
);

export default Routes;