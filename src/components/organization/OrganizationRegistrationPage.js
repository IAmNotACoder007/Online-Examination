import React, { Component } from 'react';
import TextBox from '../../material_components/TextBox'
import Dialog from '../../material_components/Dialog';
import ActionButton from '../../material_components/ActionButton';
import PropTypes from 'prop-types';
import '../../styles/organization/OrganizationRegistrationStyle.css'

class OrganizationRegistration extends Component {
    defaultState = {
        Name: '',
        Email: '',
        Phone: '',
        Password: '',
        NameError: false,
        EmailError: false,
        PhoneError: false,
        PasswordError: false,
        emailErrorMsg: "Organization email must be specified"
    }

    state = { ...this.defaultState };
    nameErrorMsg = "Organization name must be specified";

    phoneErrorMsg = "Organization phone number must be specified";
    passwordErrorMsg = "Organization password must be specified";

    getDialogContent = () => {
        return (
            <div className="organization-registration-holder">
                <TextBox className="org-registration-input" id="orgName" errorMessage={this.nameErrorMsg} error={this.state.NameError} onChange={this.onChange} fieldName="Name" placeholder="Name" />
                <TextBox className="org-registration-input" id="orgEmail" errorMessage={this.state.emailErrorMsg} error={this.state.EmailError} onChange={this.onChange} fieldName="Email" placeholder="Email Address" />
                <TextBox className="org-registration-input" id="orgPhone" errorMessage={this.phoneErrorMsg} error={this.state.PhoneError} onChange={this.onChange} type="number" fieldName="Phone" placeholder="Phone Number" />
                <TextBox className="org-registration-input" id="orgPass" errorMessage={this.passwordErrorMsg} error={this.state.PasswordError} onChange={this.onChange} type="password" fieldName="Password" placeholder="Password" />
            </div>
        )
    }
    onChange = (fieldName, val) => {
        const errorField = `${fieldName}Error`;
        this.setState({ [fieldName]: val.trim(), [errorField]: !val.trim() });

    }
    getDialogButtons = () => {
        return (
            <div>
                <ActionButton text="Register" onClick={this.registerOrganization} flatButton={true} />
                <ActionButton text="Cancel" onClick={this.closeDialog} flatButton={true} />
            </div>
        )
    }

    registerOrganization = () => {
        if (this.isValidForm()) {
            fetch('http://127.0.0.1:8080/registerOrganization/', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: this.state.Name,
                    email: this.state.Email,
                    phone: this.state.Phone,
                    password: this.state.Password
                })
            }).then((response) => {
                return response.json();
            }).then((data) => {
                if (data.isAlreadyExists) {
                    this.setState({ EmailError: true, emailErrorMsg: "Organization already exists" });
                } else {
                    this.closeDialog();
                }
            });


        }
    }

    isValidForm = () => {
        const name = this.state.Name;
        const email = this.state.Email;
        const phone = this.state.Phone;
        const password = this.state.Password;
        this.setState({ NameError: !name, EmailError: !email, PhoneError: !phone, PasswordError: !password })
        return (name && email && phone && password)
    }

    closeDialog = () => {
        this.setState({ ...this.defaultState })
        this.props.closeHandler();
    }

    render() {
        return (
            <Dialog isOpen={this.props.open} dialogTitle="Register Organization" dialogContent={this.getDialogContent()} dialogButtons={this.getDialogButtons()} />
        )
    }
}

export default OrganizationRegistration;

OrganizationRegistration.propTypes = {
    open: PropTypes.bool.isRequired,
    closeHandler: PropTypes.func.isRequired
}

OrganizationRegistration.defaultProps = {
    open: false
}