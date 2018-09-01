import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import AddIcon from '@material-ui/icons/Add';
import PaperSheet from '../../material_components/PaperSheet';
import '../../styles/organization/ManageAdminsStyle.css';
import RegisterPage from '../RegisterPage'
import { subscribeToEvent, emitEvent } from '../../Api.js';
import EditAction from '../common/EditAction';
import DeleteAction from '../common/DeleteAction';
import TextBox from '../../material_components/TextBox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

class ManageAdmins extends Component {
    defaultState = {
        isDialogOpen: false,
        isAdminAlreadyExist: false,
        refereshAdminsList: false,
        fullNameError: false,
        emailError: false,
        phoneError: false,
        fullName: '',
        email: '',
        phone: '',
        isSuspended: undefined
    }

    state = { ...this.defaultState }

    adminsList = [];
    fullNameErrorMsg = "Name must be specified";
    emailErrorMsg = "Email must be specified";
    phoneErrorMsg = "Phone must be specified";
    editedName = "";
    editedEmail = "";
    editedPhone = "";

    getContent = () => {
        return (
            <div className="manage-admins-content">
                <main>
                    {this.getMainContent()}
                </main>
                <footer>
                    <div className="add-button">
                        <Tooltip title="Add New Admin">
                            <Button onClick={this.openAddAdminDialog} variant="fab" color="primary" aria-label="add">
                                <AddIcon />
                            </Button>
                        </Tooltip>
                    </div>
                </footer>
            </div>
        )
    }

    openAddAdminDialog = () => {
        this.setState({ isDialogOpen: true });
    }

    handleClose = () => {
        this.setState({ isDialogOpen: false });
    }

    getMainContent = () => {
        if (this.adminsList && this.adminsList.length) {
            return (
                <div className='admins-list-container'>
                    {this.getAdminsList()}
                </div>
            )
        } else {
            return (
                <div className="no-data-found">No Data Found</div>
            )
        }
    }

    saveAdminInfo = (userId) => {

    }

    deleteAdmin = () => {

    }

    updateSuspention = name => event => {
        this.setState({ [name]: event.target.checked });
    };

    getEditAdminContent = (adminInfo) => {
        return (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <TextBox onChange={this.handleValueChange} errorMessage={this.fullNameErrorMsg} error={this.state.fullNameError} id={adminInfo.user_id} fieldName="fullName" defaultValue={adminInfo.full_name}></TextBox>
                <TextBox onChange={this.handleValueChange} errorMessage={this.emailErrorMsg} error={this.state.emailError} id={adminInfo.user_id} fieldName="email" defaultValue={adminInfo.email_address}></TextBox>
                <TextBox onChange={this.handleValueChange} errorMessage={this.phoneErrorMsg} error={this.state.phoneError} id={adminInfo.user_id} fieldName="phone" defaultValue={adminInfo.phone} type="number"></TextBox>
                <FormControlLabel
                    label="Suspended"
                    control={
                        <Switch
                            checked={this.state.isSuspended === undefined ? adminInfo.is_suspended : this.state.isSuspended}
                            onChange={this.updateSuspention('isSuspended')}
                            value="isSuspended"
                            color="primary"
                        />
                    }

                />
            </div>
        )
    }

    handleValueChange = (fieldName, val) => {
        this.setState({ [fieldName]: val, [`${fieldName}Error`]: !val.trim() })
    }

    isValidForm = () => {
        return (!this.state.fullNameError && !this.state.emailError && !this.state.phoneError)
    }

    getAdminsList = () => {
        return (this.adminsList.map(info => {
            const indicatorClass = info.is_suspended ? "suspended-admin" : "active-admin"
            return (
                <div className="admin-info">
                    <span className={`admin-statue ${indicatorClass}`}></span>
                    <text style={{ textTransform: 'capitalize' }}>{info.full_name}</text>
                    <text>{info.email_address}</text>
                    <text>{info.phone}</text>
                    <div className="actions-holder">
                        <EditAction disableSaveButton={!this.isValidForm()} onSave={() => { return (this.saveAdminInfo(info.user_id)) }} contentSource={() => { return (this.getEditAdminContent(info)) }}></EditAction>
                        <DeleteAction onDelete={this.deleteAdmin}></DeleteAction>
                    </div>
                </div>
            )
        }));
    }

    registerAdmin = (data) => {
        if (!data || Object.keys(data) === null) return;
        const adminInfo = { isAdmin: true, organizationId: this.props.organizationId, ...data };
        emitEvent("addNewUser", adminInfo)
    }



    render() {
        subscribeToEvent("userAlreadyExist", () => {
            this.setState({ isAdminAlreadyExist: true })
        })

        subscribeToEvent("operationSuccessful", () => {
            this.setState({ isDialogOpen: false })
        })
        return (
            <div className="manage-admins-page-holder">
                <PaperSheet classes="manage-admins-page-paper" content={this.getContent()} />
                <RegisterPage register={this.registerAdmin} isalreadyRegister={this.state.isAdminAlreadyExist} open={this.state.isDialogOpen} handleClose={this.handleClose} title="Add admin" />
            </div>
        )
    }

    componentDidMount() {
        fetch(`http://127.0.0.1:8080/getAdminsForOrganization?organizationId=${this.props.organizationId}`).then((response) => {
            return response.json();
        }).then((data) => {
            this.adminsList = data;
            this.setState({ refereshAdminsList: true });
        });
    }
}

export default ManageAdmins;
