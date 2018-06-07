import React, { Component } from 'react';
import TextBox from '../material_components/TextBox';
import ActionButton from '../material_components/ActionButton';
import PaperSheet from '../material_components/PaperSheet';
import { Link } from 'react-router-dom';
import '../styles/RegisterPage.css'


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
        }

        this.validateSignUpForm = () => {
            if (!this.state.fullName) {
                this.setState({ fullNameError: true });
            } else {
                this.setState({ fullNameError: false });
            }
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
            if (!this.state.emailAddress) {
                this.setState({ emailError: true });
            } else {
                this.setState({ emailError: false });
            }
            if (!this.state.mobileNumber) {
                this.setState({ mobileError: true });
            } else {
                this.setState({ mobileError: false });
            }
            if (!this.state.dob) {
                this.setState({ dobError: true });
            } else {
                this.setState({ dobError: false });
            }
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