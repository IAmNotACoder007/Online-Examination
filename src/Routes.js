import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import Login from './Login';
import Register from './components/RegisterPage';
import AdminPage from './components/admin/AdminPage';
import ExamPage from './components/users/ExamPage';
import SelectExam from './components/users/SelectExam';
import cookie from 'react-cookies';
import TopBar from './components/common/AppTopBar';
import Thankyou from './components/users/ThankyouPage';


class Routes extends Component {
    currentComponent;

    getUserId = () => {
        const userId = cookie.load('userId');
        return userId === "undefined" ? '' : userId
    }

    isLoggedIn() {
        return (this.getUserId() || this.getOrganizationid()) ? true : false;
    }

    getOrganizationid = () => {
        const organizationId = cookie.load('organizationId');
        return organizationId === "undefined" ? '' : organizationId
    }

    logOut = () => {
        cookie.remove('userId');
        cookie.remove('organizationId');
        cookie.remove('isAdmin');
    }

    isStudent = () => {
        const isAdmin = cookie.load('isAdmin');
        return isAdmin === "false";
    }

    renderComponent(componentName, props) {
        const isAdmin = cookie.load('isAdmin') === "true";
        const loginInfo = { organizationId: this.getOrganizationid(), isAdmin: isAdmin, userId: this.getUserId() }
        const componentProps = { ...props, ...loginInfo }
        const topBarProps = { logOut: this.logOut, ...componentProps }
        this.currentComponent = componentName;
        return (
            <div className="components-holder">
                <TopBar {...topBarProps} />
                <this.currentComponent {...componentProps} />
            </div>
        )
    }
    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route exact path='/' render={() =>
                        <Redirect to="/login" />
                    } />
                    <Route path='/login' render={(props) => {
                        return (this.renderComponent(Login, props.location.state));
                    }} />
                    <Route path='/register' render={() => this.renderComponent(Register)} />
                    <Route path='/admin' render={(props) => {
                        if (this.isLoggedIn())
                            return (this.renderComponent(AdminPage, { isOrganization: props.location.state.isOrganization }))
                        else {
                            return (<Redirect to={{
                                pathname: '/login',
                                search: `?returnUrl=${window.location.href}`,
                                state: { referrer: window.location.pathname }
                            }} />)
                        }
                    }} />
                    <Route path='/selectExam' render={() => this.renderComponent(SelectExam, { isStudentLogin: true })} />
                    <Route path='/exam' render={() => {
                        if (this.isLoggedIn() && this.isStudent())
                            return (this.renderComponent(ExamPage, { isStudentLogin: true }))
                        else {
                            return (<Redirect to={{
                                pathname: '/login',
                                search: `?returnUrl=${window.location.href}`,
                                state: { isStudentLogin: true }
                            }} />)
                        }
                    }
                    } />
                    <Route path='/logout' render={(props) => {
                        this.logOut();
                        return (<Redirect to="/login" />)

                    }} />
                    <Route path='/thankyou' render={() => {
                        this.logOut();
                        return (<Thankyou />)
                    }} />

                </Switch>
            </BrowserRouter>
        )
    }
}

export default Routes;
