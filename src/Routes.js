import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import Login from './Login';
import Register from './components/RegisterPage'

class Routes extends Component {
    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route exact path='/' render={() =>
                        <Redirect to="/login" />
                    } />
                    <Route path='/login' render={() => <Login />} />
                    <Route path='/register' render={() => <Register />} />

                </Switch>
            </BrowserRouter>
        )
    }
}

export default Routes;
