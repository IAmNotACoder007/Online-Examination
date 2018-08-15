import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import Login from './Login';
import Register from './components/RegisterPage';
import AdminPage from './components/admin/AdminPage';
import ExamPage from './components/users/ExamPage'
import SelectExam from './components/users/SelectExam'
import cookie from 'react-cookies'

class Routes extends Component {
    isLoggedIn() {
        const userId = cookie.load('userId')
        return userId ? true : false;
    }
    render() {

        return (
            <BrowserRouter>
                <Switch>
                    <Route exact path='/' render={() =>
                        <Redirect to="/login" />
                    } />
                    <Route path='/login' render={() => <Login />} />
                    <Route path='/register' render={() => <Register />} />
                    <Route path='/admin' render={() => {
                        if (this.isLoggedIn())
                            return (<AdminPage />)
                        else {
                            return (<Redirect to={{
                                pathname: '/login',
                                search: `?returnUrl=${window.location.href}`,
                                state: { referrer: window.location.pathname }
                            }} />)
                        }
                    }} />
                    <Route path='/selectExam' render={() => <SelectExam />} />
                    <Route path='/exam' render={() => {
                        if (this.isLoggedIn())
                            return (<ExamPage />)
                        else {
                            return (<Redirect to={{
                                pathname: '/login',
                                search: `?returnUrl=${window.location.href}`,
                                state: { referrer: window.location.pathname }
                            }} />)
                        }
                    }
                    } />
                </Switch>
            </BrowserRouter>
        )
    }
}

export default Routes;
