import React, { Component } from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import ActionButton from '../../material_components/ActionButton';
import MaterialDialog from '../../material_components/Dialog';

class DeleteAction extends Component {
    state = {
        openDialog: false
    }
    askConfirmation = () => {
        this.setState({ openDialog: true })
    }
    getDialogContent = () => {
        return (
            <div className="confirmation-dialog">                
                <text>{this.props.message}</text>
            </div>
        )
    }

    getDialogButtons = () => {
        return (
            <div className="delete-dialog-buttons">
                <ActionButton text="Delete" flatButton={true} onClick={this.props.onDelete} />
                <ActionButton text="Cancel" flatButton={true} onClick={this.onclose} />
            </div>
        )
    }
    onclose = () => {
        this.setState({ openDialog: false })
        if (this.props.onclose)
            this.props.onclose();
    }

    render() {
        return (
            <div className="delete-action" style={{ height: '48px', width: '48px' }}>
                <IconButton onClick={this.askConfirmation}>
                    <DeleteIcon />
                </IconButton>
                <MaterialDialog dialogTitle={this.props.dialogTitle} styleClass={this.props.dialogClass} isAlertDialog={true} isOpen={this.state.openDialog} dialogContent={this.getDialogContent()} dialogButtons={this.getDialogButtons()} />
            </div>
        )
    }
}

DeleteAction.propTypes = {
    onDelete: PropTypes.func.isRequired,
    message: PropTypes.string,
    onclose: PropTypes.func,
    dialogTitle: PropTypes.string,
    dialogClass: PropTypes.string
}

DeleteAction.defaultProps = {
    message: "Are you sure you want to delete it?",
    onclose: undefined,
    dialogTitle: "Delete",
    dialogClass: ""
}
export default DeleteAction