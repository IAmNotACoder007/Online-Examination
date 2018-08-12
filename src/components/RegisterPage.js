import React, { Component } from 'react';
import TextBox from '../material_components/TextBox';
import ActionButton from '../material_components/ActionButton';
import PaperSheet from '../material_components/PaperSheet';
import { Link } from 'react-router-dom';
import '../styles/RegisterPage.css';
import { subscribeToEvent, emitEvent } from '../Api.js';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import '../../node_modules/react-notifications/dist/react-notifications.css';



class Register extends Component {
    /**
     * fullName
     * username
     * email
     * mobile
     * dob
     * password
     */
    constructor(props) {
        super(props);
        this.userNameErrorMessage = "Username must be specified";
        this.passwordErrorMessage = "Password must be specified";
        this.fullNameErrorMessage = "Full name must be specified";
        this.emailErrorMessage = "Email address must be specified";
        this.mobileErrorMessage = "Mobile number must be specified";
        this.dobErrorMessage = "Date of birth must be specified";
        this.isValidForm = true;

        subscribeToEvent("userAddedSuccessfully", () => {
            NotificationManager.success('Sign Up successfully');
            this.setState({
                fullName: '',
                userName: '',
                password: '',
                emailAddress: '',
                mobileNumber: '',
                dob: ''
            })
        });

        subscribeToEvent("userAdditionFailed", () => {
            NotificationManager.error('Something went wrong');
        });

        this.state = {
            userNameError: false,
            passwordError: false,
            fullNameError: false,
            emailError: false,
            mobileError: false,
            dobError: false,
            fullName: '',
            userName: '',
            password: '',
            emailAddress: '',
            mobileNumber: '',
            dob: ''
        }

        this.doSignUp = () => {
            this.validateSignUpForm();
            if (this.isValidForm) {
                emitEvent("addNewUser", {
                    fullName: this.state.fullName, userName: this.state.userName, password: this.state.password,
                    emailAddress: this.state.emailAddress, mobileNumber: this.state.mobileNumber, dateOfBirth: new Date(this.state.dob).toISOString(), isAdmin: false
                });
            }
        }

        this.validateSignUpForm = () => {
            this.isValidForm = true;
            if (!this.state.fullName) {
                this.markAsInvalidField('fullNameError')
            } else {
                this.setState({ fullNameError: false });
            }
            if (!this.state.userName) {
                this.markAsInvalidField('userNameError')
            } else {
                this.setState({ userNameError: false });
            }
            if (!this.state.password) {
                this.markAsInvalidField("passwordError")
            } else {
                this.setState({ passwordError: false });
            }
            if (!this.state.emailAddress) {
                this.markAsInvalidField("emailError");
            } else {
                this.setState({ emailError: false });
            }
            if (!this.state.mobileNumber) {
                this.markAsInvalidField("mobileError");
            } else {
                this.setState({ mobileError: false });
            }
            if (!this.state.dob) {
                this.markAsInvalidField("dobError")
            } else {
                this.setState({ dobError: false });
            }
        }

        this.markAsInvalidField = (fieldName) => {
            this.isValidForm = false;
            this.setState({ [fieldName]: true });
        }

        this.handleChange = (fieldName, val) => {
            this.setState({ [fieldName]: val }, () => {
                this.validateSignUpForm();
            })
        }

        this.getRegisterPaperContent = () => {
            const primaryTheme = {
                light: '#80CBC4',
                main: '#26A69A',
                dark: '#00897B',
                contrastText: '#fff',
            }
            return (
                <div className="register-page-container">
                    <header className="register-header">
                        <h1 className="sign-in">Sign Up</h1>
                    </header>
                    <main className="main-content">
                        <div className="register-page-paper-content">
                            <TextBox errorMessage={this.fullNameErrorMessage} primaryTheme={primaryTheme} error={this.state.fullNameError} required={true} id="fullName" fieldName="fullName" placeholder="Full name" label="Full name" onChange={this.handleChange} />
                            <TextBox errorMessage={this.userNameErrorMessage} primaryTheme={primaryTheme} error={this.state.userNameError} required={true} id="userName" fieldName="userName" placeholder="Username" label="Username" onChange={this.handleChange} />
                            <TextBox errorMessage={this.passwordErrorMessage} primaryTheme={primaryTheme} error={this.state.passwordError} required={true} id="password" fieldName="password" type="password" label="Password" placeholder="Password" onChange={this.handleChange} />
                            <TextBox errorMessage={this.emailErrorMessage} primaryTheme={primaryTheme} error={this.state.emailError} required={true} id="emailAddress" fieldName="emailAddress" type="email" label="Email address" placeholder="Email address" onChange={this.handleChange} />
                            <TextBox errorMessage={this.mobileErrorMessage} primaryTheme={primaryTheme} error={this.state.mobileError} required={true} id="mobileNumber" fieldName="mobileNumber" type="number" label="Mobile number" placeholder="Mobile number" onChange={this.handleChange} />
                            <TextBox errorMessage={this.dobErrorMessage} primaryTheme={primaryTheme} error={this.state.dobError} required={true} id="dob" type="date" fieldName="dob" label="Date of birth" onChange={this.handleChange} />
                        </div>
                    </main>
                    <ActionButton primaryButtonTheme={primaryTheme} color="primary" onClick={this.doSignUp} text="Sign Up" />
                    <footer>
                        <div className="register-page-footer-container">
                            <span className="footer-text">Have an account?</span><Link to="/login" className="create-account-link">Login</Link>
                        </div>
                    </footer>
                    <NotificationContainer />
                </div>
            )
        }

    }
    render() {
        return (
            <div className="register-container" >
                <PaperSheet classes="register-page-paper" content={this.getRegisterPaperContent()} />
            </div>
        )
    }
}

export default Register;