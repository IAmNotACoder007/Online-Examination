import React, { Component } from 'react';
import TextBox from '../material_components/TextBox';
import ActionButton from '../material_components/ActionButton';
import { emitEvent } from '../Api.js';
import '../../node_modules/react-notifications/dist/react-notifications.css';
import MaterialDialog from '../material_components/Dialog';
import PropTypes from 'prop-types';


class Register extends Component {
    /**
     * fullName
     * email
     * mobile     
     * password
     */
    constructor(props) {
        super(props);
        this.passwordErrorMessage = "Password must be specified";
        this.fullNameErrorMessage = "Full name must be specified";
        this.emailErrorMessage = "Email address must be specified";
        this.mobileErrorMessage = "Mobile number must be specified";

        this.initialState = {
            passwordError: false,
            fullNameError: false,
            emailAddressError: false,
            mobileNumberError: false,
            fullName: '',
            password: '',
            emailAddress: '',
            mobileNumber: '',
        }

        this.state = { ...this.initialState }

        this.getDialogButtons = () => {
            return (
                <div>
                    <ActionButton flatButton={true} text="Add" onClick={this.registerUser} />
                    <ActionButton flatButton={true} text="Cancel" onClick={this.closeDialog} />
                </div>
            )
        }

        this.closeDialog = () => {
            this.props.handleClose();
        }

        this.registerUser = () => {
            if (this.isValidForm()) {
                emitEvent("addNewUser", {
                    organizationId: this.props.organizationId,
                    fullName: this.state.fullName, password: this.state.password,
                    emailAddress: this.state.emailAddress, mobileNumber: this.state.mobileNumber, isAdmin: this.props.isAdmin
                });
                this.closeDialog();
            }
        }

        this.isValidForm = () => {
            this.setState({
                passwordError: !this.state.password,
                fullNameError: !this.state.fullName,
                emailAddressError: !this.state.emailAddress,
                mobileNumberError: !this.state.mobileNumber,
            });

            return this.state.password && this.state.fullName && this.state.emailAddress && this.state.mobileNumber;
        }
        this.getDialogContent = () => {
            return (
                <div className="register-page-paper-content" style={{ display: 'flex', flexDirection: 'column' }}>
                    <TextBox errorMessage={this.fullNameErrorMessage} error={this.state.fullNameError} required={true} id="fullName" fieldName="fullName" placeholder="Full name" label="Full name" onChange={this.handleChange} />
                    <TextBox errorMessage={this.passwordErrorMessage} error={this.state.passwordError} required={true} id="password" fieldName="password" type="password" label="Password" placeholder="Password" onChange={this.handleChange} />
                    <TextBox errorMessage={this.emailErrorMessage} error={this.state.emailAddressError} required={true} id="emailAddress" fieldName="emailAddress" type="email" label="Email address" placeholder="Email address" onChange={this.handleChange} />
                    <TextBox errorMessage={this.mobileErrorMessage} error={this.state.mobileNumberError} required={true} id="mobileNumber" fieldName="mobileNumber" type="number" label="Mobile number" placeholder="Mobile number" onChange={this.handleChange} />
                </div>

            )
        }
        this.handleChange = (fieldName, val) => {
            this.setState({ [fieldName]: val, [`${fieldName}Error`]: (!val.trim()) })
        }

    }
    render() {
        return (
            <div className="register-container" >
                <MaterialDialog dialogTitle={this.props.title} styleClass="register-dialog" dialogContent={this.getDialogContent()} dialogButtons={this.getDialogButtons()} isOpen={this.props.open} />
            </div>
        )
    }
}

export default Register;

Register.propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    isAdmin: PropTypes.bool.isRequired,
    title: PropTypes.string
}
Register.defaultProps = {
    open: false,
    title: '',
    isAdmin: false
}