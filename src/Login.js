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
import Themes from './components/admin/Themes';
import CircularProgress from '@material-ui/core/CircularProgress';

class Login extends Component {
    constructor(props) {
        super(props);
        this.defaultState = {
            userNameError: false,
            userMailError: false,
            passwordError: false,
            userName: "",
            password: "",
            userMail: '',
            navigate: false,
            isOrganizationLogin: true,
            openRegisterDialog: false,
            isSuspendedAccount: false,
            forgotPassword: false,
            forOrganizationPassword: true,
            userMailErrorMessage: "Email must be specified",
            loading: false
        }
        this.state = {
            ...this.defaultState
        }
        this.redirectTo = "";
        this.theme = Themes.defaultTheme;
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
            this.setState({ [name]: isOrganizationLogin })
        }

        this.getQueryStringValueFromUrl = (queryString) => {
            const urlSearchParams = new URLSearchParams(window.location.search);
            return urlSearchParams.get(queryString)
        }

        subscribeToEvent("emailNotFound", () => {
            this.setState({ userMailError: true, loading: false, userMailErrorMessage: "Email address is not register" });
        });

        subscribeToEvent("passwordGeneratedSuccessfully", () => {
            this.closeDialog();
        });


        subscribeToEvent("loginSuccessful", (data) => {
            const userInfo = JSON.parse(data)[0];
            const returnUrl = this.getQueryStringValueFromUrl('returnUrl');
            if (returnUrl) { this.redirectTo = new URL(returnUrl); }
            if (userInfo.is_admin) {
                if (userInfo.is_suspended) {
                    this.setState({ isSuspendedAccount: true });
                    return false;
                } else {
                    if (!this.redirectTo)
                        this.redirectTo = new URL(`${window.location.origin}/admin`);
                    this.updateCookies(userInfo.user_id, userInfo.organization_id, true);
                    this.redirectWithTheme(userInfo.user_id);
                }

            } else {
                if (!this.redirectTo)
                    this.redirectTo = new URL(`${window.location.origin}/selectExam`);
                this.updateCookies(userInfo.user_id, userInfo.organization_id, false);
                this.setState({ navigate: true });
            }

        });

        subscribeToEvent("organizationLoginSuccessful", (data) => {
            const userInfo = JSON.parse(data)[0];
            this.redirectTo = new URL(`${window.location.origin}/admin`);
            this.updateCookies(userInfo.user_id, userInfo.organization_id, true);
            this.redirectWithTheme(userInfo.organization_id);
        });

        subscribeToEvent("userNotRegister", () => {
            this.userNameErrorMessage = "Username or password is incorrect";
            this.setState({ userNameError: true });
        });

        this.redirectWithTheme = (userId) => {
            this.getUserTheme(userId).then((theme) => {
                this.theme = theme;
                this.setState({ navigate: true });
            })
        }

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
                    <CheckBox value="isOrganizationLogin" onChange={this.isOrganizationLogin} checked={this.state.isOrganizationLogin} label="Organization Login"></CheckBox>
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
                        <TextBox fullWidth={true} fieldName="userName" errorMessage={this.userNameErrorMessage} inputAdornment={<AccountCircle />} error={this.state.userNameError} required={true} id="userName" placeholder="Username" onChange={this.handleChange} />
                        <TextBox fullWidth={true} fieldName="password" errorMessage={this.passwordErrorMessage} inputAdornment={<PasswordIcon />} error={this.state.passwordError} required={true} id="password" type="password" placeholder="Password" onChange={this.handleChange} />
                        {this.getCheckboxForOrganizationLogin()}
                        <ActionButton color="primary" onClick={this.doLogin} text="Login" />
                        <a className="forgot-password-link" onClick={() => {
                            this.setState({ forgotPassword: true });
                        }}>Forgot Password?</a>
                    </main>
                    {this.getLoginFooter()}
                </div>
            )
        }

        this.handleChange = (fieldName, val) => {            
            this.setState({ [fieldName]: val, [`${fieldName}Error`]: !val.trim(),userMailErrorMessage: "Email must be specified", });
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

        this.getForgotPassDialogContent = () => {
            return (
                <div>
                    <TextBox fullWidth={true} fieldName="userMail" errorMessage={this.state.userMailErrorMessage} error={this.state.userMailError} required={true} id="userMail" placeholder="Email" onChange={this.handleChange} />
                    <CheckBox value="forOrganizationPassword" onChange={this.isOrganizationLogin} checked={this.state.forOrganizationPassword} label="Is Organization"></CheckBox>
                </div>
            )
        }

        this.getForgotPassDialogButton = () => {
            const classes = {
                buttonProgress: {
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    marginTop: -12,
                    marginLeft: -12,
                },
            }
            return (
                <div className="password-dialog-button-holder" style={{ display: 'flex' }}>
                    <div style={{ position: 'relative' }}>
                        <ActionButton disabled={this.state.loading} flatButton={true} text="Send" onClick={() => { this.generatePassword() }} />
                        {this.state.loading && <CircularProgress size={24} style={classes.buttonProgress} />}
                    </div>
                    <ActionButton flatButton={true} text="Cancel" onClick={() => { this.closeDialog() }} />
                </div>
            )
        }

        this.closeDialog = () => {
            this.setState({
                openRegisterDialog: false,
                forgotPassword: false,
                userMailError: false,
                userMailErrorMessage: "Email must be specified",
                loading: false
            });
        }

        this.generatePassword = () => {
            if (!this.state.userMail) {
                this.setState({ userMailError: true });
            } else {
                this.setState({ loading: true });
                emitEvent("generatePassword", { email: this.state.userMail, isOrganization: this.state.forOrganizationPassword })
            }
        }

        this.getSuspendedAccountMsgDialogButton = () => {
            return <ActionButton flatButton={true} text="Ok" onClick={() => { this.closeDialog() }} />
        }

    }
    render() {
        const theme = createMuiTheme({
            palette: {
                primary: {
                    ...Themes.defaultTheme
                }
            }
        });
        if (this.state.navigate) {
            return <Redirect to={{
                pathname: this.redirectTo.pathname,
                search: this.redirectTo.search,
                state: { isOrganization: this.state.isOrganizationLogin, theme: this.theme }
            }} push={true} />
        }
        return (
            <MuiThemeProvider theme={theme}>
                <div className="login-container" >
                    <PaperSheet classes="login-page-paper" content={this.getLoginPaperContent()} />
                    <Dialog isAlertDialog={true} isOpen={this.state.isSuspendedAccount} dialogTitle="Warning" dialogButtons={this.getSuspendedAccountMsgDialogButton()} dialogContent={this.getSuspendedAccountsMessage()}></Dialog>
                    <Dialog styleClass="password-dialog" isOpen={this.state.forgotPassword} dialogTitle="Password" dialogButtons={this.getForgotPassDialogButton()} dialogContent={this.getForgotPassDialogContent()}></Dialog>
                </div>
            </MuiThemeProvider>
        )
    }

    async getUserTheme(userId) {
        const theme = await Themes.getCurrentTheme(userId);
        return theme;
    }
}

export default Login;