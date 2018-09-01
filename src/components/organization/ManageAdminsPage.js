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

class ManageAdmins extends Component {
    state = {
        isDialogOpen: false,
        isAdminAlreadyExist: false,
        refereshAdminsList: false
    }

    adminsList = [];

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

    saveAdminInfo = () => {

    }

    deleteAdmin = () => {

    }

    getEditAdminContent = (adminInfo) => {
        return (
            <div>
                <TextBox id={adminInfo.user_id} fieldName="fullName" defaultValue={adminInfo.full_name}></TextBox>
                <TextBox id={adminInfo.user_id} fieldName="email" defaultValue={adminInfo.email_address}></TextBox>
                <TextBox id={adminInfo.user_id} fieldName="phone" defaultValue={adminInfo.phone} type="number"></TextBox>
            </div>
        )
    }

    getAdminsList = () => {
        return (this.adminsList.map(info => {
            return (
                <div className="admin-info">
                    <text>{info.full_name}</text>
                    <text>{info.email_address}</text>
                    <text>{info.phone}</text>
                    <div className="actions-holder">
                        <EditAction onSave={this.saveAdminInfo} contentSource={() => { return (this.getEditAdminContent(info)) }}></EditAction>
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
