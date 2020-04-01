import React from 'react';
import {Switch, Route} from 'react-router-dom';

import MainPage from './pages/MainPage/MainPage';
import LoginPage from './pages/LoginPage/LoginPage';
import SignupPage from './pages/SignupPage/SignupPage';
import PasswordRecoveryPage from './pages/PasswordRecoveryPage/PasswordRecoveryPage';
import UserPage from './pages/UserPage/UserPage';

const Routes = () => (
    <Switch>
        <Route exact path='/' component={MainPage} />
        <Route exact path='/login' component={LoginPage} />
        <Route exact path='/signup' component={SignupPage} />
        <Route exact path='/password-recovery' component={PasswordRecoveryPage} />
        <Route exact path='/user' component={UserPage} />
    </Switch>
);

export default Routes;