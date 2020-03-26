import React from 'react';
import {Switch, Route} from 'react-router-dom';

import Main from './components/Main';
import Login from './components/Login/Login';
import Signup from './components/Signup/Signup';


const Routes = () => (
    <Switch>
        <Route exact path='/signup' component={Signup} />
        <Route exact path='/login' component={Login} />
        <Route exact path='/' component={Main} />
    </Switch>
);

export default Routes;