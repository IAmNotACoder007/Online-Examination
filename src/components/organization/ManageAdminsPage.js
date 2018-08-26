import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import AddIcon from '@material-ui/icons/Add';
import PaperSheet from '../../material_components/PaperSheet';
import '../../styles/organization/ManageAdminsStyle.css';
import RegisterPage from '../RegisterPage'

class ManageAdmins extends Component {
    state = {
        isDialogOpen: false
    }

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
        return (
            <div className="no-data-found">No Data Found</div>
        )
    }


    render() {
        return (
            <div className="manage-admins-page-holder">
                <PaperSheet classes="manage-admins-page-paper" content={this.getContent()} />
                <RegisterPage open={this.state.isDialogOpen} handleClose={this.handleClose} title="Add admin"/>
            </div>
        )
    }
}

export default ManageAdmins;
