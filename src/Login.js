import React, { Component } from 'react';
import PaperSheet from './material_components/PaperSheet';
import TextBox from './material_components/TextBox';
import './styles/Login.css';
import ActionButton from './material_components/ActionButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import PasswordIcon from '@material-ui/icons/Https';
import { subscribeToEvent, emitEvent } from './Api.js';
import cookie from 'react-cookies';
import { Redirect } from 'react-router-dom';
import CheckBox from './material_components/MaterialCheckBox'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Register from './components/RegisterPage';
import Dialog from './material_components/Dialog';
import WarningIcon from '@material-ui/icons/Warning';

class Login extends Component {
    constructor(props) {
        super(props);
        this.defaultState = {
            userNameError: false,
            passwordError: false,
            userName: "",
            password: "",
            navigate: false,
            isOrganizationLogin: true,
            openRegisterDialog: false,
            isSuspendedAccount: false,
        }
        this.state = {
            ...this.defaultState
        }
        this.redirectTo = "";
        this.userNameErrorMessage = "Username must be specified";
        this.passwordErrorMessage = "Password must be specified";
        this.doLogin = () => {
            this.validateFields();
            if (this.state.isOrganizationLogin && !this.props.isStudentLogin)
                emitEvent("doOrganizationLogin", { userId: this.state.userName, password: this.state.password });
            else
                emitEvent("doLogin", { userName: this.state.userName, password: this.state.password });
        }

        this.isOrganizationLogin = (name, isOrganizationLogin) => {
            this.setState({ isOrganizationLogin: isOrganizationLogin })
        }

        this.getQueryStringValueFromUrl = (queryString) => {
            const urlSearchParams = new URLSearchParams(window.location.search);
            return urlSearchParams.get(queryString)
        }
        subscribeToEvent("loginSuccessful", (data) => {
            const userInfo = JSON.parse(data)[0];
            const returnUrl = this.getQueryStringValueFromUrl('returnUrl');
            if (returnUrl) { this.redirectTo = new URL(returnUrl); }
            else {
                if (userInfo.is_admin) {
                    if (userInfo.is_suspended) {
                        this.setState({ isSuspendedAccount: true });
                        return;
                    } else {
                        this.redirectTo = new URL(`${window.location.origin}/admin`);
                    }

                } else {
                    this.redirectTo = new URL(`${window.location.origin}/selectExam`);
                }
            }
            this.updateCookies(userInfo.user_id, userInfo.organization_id, !!parseInt(userInfo.is_admin));
            this.setState({ navigate: true });
        });

        subscribeToEvent("organizationLoginSuccessful", (data) => {
            const userInfo = JSON.parse(data)[0];
            this.redirectTo = new URL(`${window.location.origin}/admin`);
            this.updateCookies(userInfo.user_id, userInfo.organization_id, true);
            this.setState({ navigate: true });
        });

        subscribeToEvent("userNotRegister", () => {
            this.userNameErrorMessage = "Username or password is incorrect";
            this.setState({ userNameError: true });
        });

        this.updateCookies = (userId, organizationId, isAdmin) => {
            cookie.save('userId', userId);
            cookie.save('organizationId', organizationId);
            cookie.save('isAdmin', isAdmin);
        }

        this.registerStudent = (data) => {
            const orgid = this.getQueryStringValueFromUrl('orgId');
            const userInfo = { organizationId: orgid, isAdmin: false, ...data }
            emitEvent("addNewUser", userInfo);
            this.handleDialogClose();
        }
        this.handleDialogClose = () => {
            this.setState({ openRegisterDialog: false })
        }
        this.getLoginFooter = () => {
            if (this.props.isStudentLogin) {
                return (
                    <footer>
                        <div className="login-page-footer-container">
                            <span className="footer-text">Don't have an account?</span><a className="create-account-link" onClick={() => {
                                this.setState({ openRegisterDialog: true })
                            }}>Create one</a>
                        </div>
                        <Register title="Register" open={this.state.openRegisterDialog} register={this.registerStudent} handleClose={this.handleDialogClose}></Register>
                    </footer>
                )
            }
        }

        this.getCheckboxForOrganizationLogin = () => {
            if (!this.props.isStudentLogin) {
                return (
                    <CheckBox onChange={this.isOrganizationLogin} checked={this.state.isOrganizationLogin} label="Organization Login"></CheckBox>
                )
            }
        }

        this.getLoginPaperContent = () => {
            return (
                <div className="login-page-container">
                    <header className="login-header">
                        <h1 className="sign-in">Sign In</h1>
                    </header>
                    <main className="login-page-paper-content">
                        <TextBox fieldName="userName" errorMessage={this.userNameErrorMessage} inputAdornment={<AccountCircle />} error={this.state.userNameError} required={true} id="userName" placeholder="Username" onChange={this.handleChange} />
                        <TextBox fieldName="password" errorMessage={this.passwordErrorMessage} inputAdornment={<PasswordIcon />} error={this.state.passwordError} required={true} id="password" type="password" placeholder="Password" onChange={this.handleChange} />
                        {this.getCheckboxForOrganizationLogin()}
                        <ActionButton color="primary" onClick={this.doLogin} text="Login" />
                        <a className="forgot-password-link">Forgot Password?</a>
                    </main>
                    {this.getLoginFooter()}
                </div>
            )
        }

        this.handleChange = (fieldName, val) => {
            this.setState({ [fieldName]: val, [`${fieldName}Error`]: !val.trim() });

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

        this.getSuspendedAccountsMessage = () => {
            return (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <WarningIcon style={{ height: "60px", width: '60px' }} color="error" />
                    <text>Your account has been temporary suspended, Please contact your organization</text>
                </div>
            )
        }

        this.getSuspendedAccountMsgDialogButton = () => {
            return <ActionButton flatButton={true} text="Ok" onClick={() => { this.setState({ isSuspendedAccount: false }) }} />
        }

    }
    render() {
        const theme = createMuiTheme({
            palette: {
                primary: {
                    light: '#90CAF9',
                    main: '#2196F3',
                    dark: '#1E88E5',
                    contrastText: '#fff',
                },
                secondary: {
                    light: '#F8BBD0',
                    main: '#E91E63',
                    dark: '#AD1457',
                    contrastText: '#fff',
                }
            }
        });
        if (this.state.navigate) {
            return <Redirect to={{
                pathname: this.redirectTo.pathname,
                search: this.redirectTo.search,
                state: { isOrganization: this.state.isOrganizationLogin }
            }} push={true} />
        }
        return (
            <MuiThemeProvider theme={theme}>
                <div className="login-container" >
                    <PaperSheet classes="login-page-paper" content={this.getLoginPaperContent()} />
                    <Dialog isAlertDialog={true} isOpen={this.state.isSuspendedAccount} dialogTitle="Warning" dialogButtons={this.getSuspendedAccountMsgDialogButton()} dialogContent={this.getSuspendedAccountsMessage()}></Dialog>
                </div>
            </MuiThemeProvider>
        )
    }
}

export default Login;