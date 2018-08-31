import React, { Component } from 'react';
import PaperSheet from './material_components/PaperSheet';
import TextBox from './material_components/TextBox';
import './styles/Login.css';
import ActionButton from './material_components/ActionButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import PasswordIcon from '@material-ui/icons/Https';
import { Link } from 'react-router-dom';
import { subscribeToEvent, emitEvent } from './Api.js';
import cookie from 'react-cookies';
import { Redirect } from 'react-router-dom';
import CheckBox from './material_components/MaterialCheckBox'

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userNameError: false,
            passwordError: false,
            userName: "",
            password: "",
            navigate: false,
            isOrganizationLogin: true
        }
        this.redirectTo = "";
        this.userNameErrorMessage = "Username must be specified";
        this.passwordErrorMessage = "Password must be specified";
        this.doLogin = () => {
            this.validateFields();
            if (this.state.isOrganizationLogin)
                emitEvent("doOrganizationLogin", { userId: this.state.userName, password: this.state.password });
            else
                emitEvent("doLogin", { email: this.state.userName, password: this.state.password });
        }

        this.isOrganizationLogin = (name, isOrganizationLogin) => {
            this.setState({ isOrganizationLogin: isOrganizationLogin })
        }

        subscribeToEvent("loginSuccessful", (data) => {
            const userInfo = JSON.parse(data)[0];
            const urlSearchParams = new URLSearchParams(window.location.search);
            const returnUrl = urlSearchParams.get('returnUrl');
            if (returnUrl) { this.redirectTo = new URL(returnUrl); }
            else {
                if (userInfo.is_admin) {
                    this.redirectTo = new URL(`${window.location.origin}/admin`);

                } else {
                    this.redirectTo = new URL(`${window.location.origin}/selectExam`);
                }
            }
            this.updateCookies(userInfo.user_id, userInfo.organization_id);
            this.setState({ navigate: true });
        });

        subscribeToEvent("organizationLoginSuccessful", (data) => {
            const userInfo = JSON.parse(data)[0];
            this.redirectTo = new URL(`${window.location.origin}/admin`);
            this.updateCookies(userInfo.user_id, userInfo.organization_id);
            this.setState({ navigate: true });
        });

        subscribeToEvent("userNotRegister", () => {
            this.userNameErrorMessage = "Username or password is incorrect";
            this.setState({ userNameError: true });
        });

        this.updateCookies = (userId, organizationId) => {
            cookie.save('userId', userId);
            cookie.save('organizationId', organizationId);
        }

        this.getLoginPaperContent = () => {
            const primaryTheme = {
                light: '#80CBC4',
                main: '#26A69A',
                dark: '#00897B',
                contrastText: '#fff',
            }

            return (
                <div className="login-page-container">
                    <header className="login-header">
                        <h1 className="sign-in">Sign In</h1>
                    </header>
                    <main className="login-page-paper-content">
                        <TextBox fieldName="userName" errorMessage={this.userNameErrorMessage} inputAdornment={<AccountCircle />} primaryTheme={primaryTheme} error={this.state.userNameError} required={true} id="userName" placeholder="Username" onChange={this.handleChange} />
                        <TextBox fieldName="password" errorMessage={this.passwordErrorMessage} inputAdornment={<PasswordIcon />} primaryTheme={primaryTheme} error={this.state.passwordError} required={true} id="password" type="password" placeholder="Password" onChange={this.handleChange} />
                        <CheckBox onChange={this.isOrganizationLogin} checked={this.state.isOrganizationLogin} label="Organization Login"></CheckBox>
                        <ActionButton primaryButtonTheme={primaryTheme} color="primary" onClick={this.doLogin} text="Login" />
                        <a className="forgot-password-link">Forgot Password?</a>
                    </main>
                    <footer>
                        <div className="login-page-footer-container">
                            <span className="footer-text">Don't have an account?</span><Link to="/register" className="create-account-link">Create one</Link>
                        </div>
                    </footer>
                </div>
            )
        }

        this.handleChange = (fieldName, val) => {
            this.setState({ [fieldName]: val }, () => {
                this.validateFields();
            });

        }

        this.validateFields = () => {
            if (!this.state.userName) {
                this.setState({ userNameError: true });
            } else {
                this.setState({ userNameError: false });
            }
            if (!this.state.password) {
                this.setState({ passwordError: true });
            } else {
                this.setState({ passwordError: false });
            }
        }

    }
    render() {
        if (this.state.navigate) {
            return <Redirect to={{
                pathname: this.redirectTo.pathname,
                search: this.redirectTo.search,
                state: { isOrganization: this.state.isOrganizationLogin }
            }} push={true} />
        }
        return (
            <div className="login-container" >
                <PaperSheet classes="login-page-paper" content={this.getLoginPaperContent()} />
            </div>
        )
    }
}

export default Login;