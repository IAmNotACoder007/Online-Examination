import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import Login from './Login';
import Register from './components/RegisterPage';
import AdminPage from './components/admin/AdminPage';
import ExamPage from './components/users/ExamPage'

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
                    <Route path='/admin' render={() => <AdminPage />} />
                    <Route path='/exam' render={() => <ExamPage />} />
                </Switch>
            </BrowserRouter>
        )
    }
}

export default Routes;
