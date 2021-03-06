import React, { Component } from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import ActionButton from '../../material_components/ActionButton';
import MaterialDialog from '../../material_components/Dialog';

class EditAction extends Component {
    state = {
        openDialog: false
    }

    getDialogButtons = () => {
        return (
            <div className="edit-dialog-buttons" style={{ display: 'flex' }}>
                {this.getExtraButtons()}
                <ActionButton disabled={this.props.disableSaveButton} text="Save" flatButton={true} onClick={this.onSave} />
                <ActionButton text="Cancel" flatButton={true} onClick={this.closeDialog} />
            </div>
        )
    }

    getExtraButtons = () => {
        if (this.props.extraButtons) {
            return (
                <div>
                    {this.props.extraButtons.map((button) => {
                        return <ActionButton key={button.text} text={button.text} flatButton={true} onClick={button.onClick} />
                    })}
                </div>
            )
        }
    }

    onSave = () => {
        if (this.props.onSave() !== false)
            this.closeDialog();

    }

    closeDialog = () => {
        this.setState({ openDialog: false });
        if (this.props.onclose)
            this.props.onclose();
    }

    editIconClickHandler = () => {
        if (this.props.onOpen) this.props.onOpen();
        this.setState({ openDialog: true })
    }

    getDialogContent = () => {
        return this.props.contentSource()
    }

    render() {
        return (
            <div className="edit-action">
                <IconButton onClick={this.editIconClickHandler}>
                    <EditIcon />
                </IconButton>
                <MaterialDialog dialogTitle={this.props.dialogTitle} styleClass={`${this.props.dialogClass} edit-action-dialog`} isOpen={this.state.openDialog} dialogContent={this.getDialogContent()} dialogButtons={this.getDialogButtons()} />
            </div>
        )
    }
}

EditAction.propTypes = {
    onSave: PropTypes.func.isRequired,
    contentSource: PropTypes.func.isRequired,
    onclose: PropTypes.func,
    dialogTitle: PropTypes.string,
    dialogClass: PropTypes.string,
    extraButtons: PropTypes.array,
    onOpen: PropTypes.func,
    disableSaveButton: PropTypes.bool
}

EditAction.defaultProps = {
    onclose: undefined,
    dialogTitle: "Edit",
    dialogClass: "",
    extraButtons: undefined,
    onOpen: undefined,
    disableSaveButton: false
}

export default EditAction;