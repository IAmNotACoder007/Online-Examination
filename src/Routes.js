import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import Login from './Login';
import Register from './components/RegisterPage';
import AdminPage from './components/admin/AdminPage';
import ExamPage from './components/users/ExamPage';
import SelectExam from './components/users/SelectExam';
import cookie from 'react-cookies';


class Routes extends Component {
    currentComponent;

    isLoggedIn() {
        const userId = cookie.load('userId')
        return userId ? true : false;
    }
    renderComponent(componentName, props) {
        const organizationId = cookie.load('organizationId');
        const componentProps = { organizationId: organizationId, ...props }
        this.currentComponent = componentName;
        return (
            <div className="components-holder">
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
                    <Route path='/login' render={() => this.renderComponent(Login)} />
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
                    <Route path='/selectExam' render={() => this.renderComponent(SelectExam)} />
                    <Route path='/exam' render={() => {
                        if (this.isLoggedIn())
                            return (this.renderComponent(ExamPage))
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
