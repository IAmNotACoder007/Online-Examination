import React, { Component } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from 'prop-types';
import Slide from '@material-ui/core/Slide';

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

class MaterialDialog extends Component {

    render() {
        let dialogProps = {
            open: this.props.isOpen,
            onClose: this.props.onDialogClose,
            fullScreen:this.props.fullScreen,
            'aria-labelledby': "responsive-dialog-title",
            classes: { paper: this.props.styleClass },
            ...(this.props.isAlertDialog && { TransitionComponent: Transition })
        }
        return (
            <div className="dialog">
                <Dialog {...dialogProps} >
                    <DialogTitle id="form-dialog-title">{this.props.dialogTitle}</DialogTitle>
                    <DialogContent>
                        {this.props.dialogContent}
                    </DialogContent>
                    <DialogActions>
                        {this.props.dialogButtons}
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

MaterialDialog.propTypes = {
    dialogContent: PropTypes.object.isRequired,
    dialogButtons: PropTypes.object.isRequired,
    dialogTitle: PropTypes.string,
    isOpen: PropTypes.bool,
    onDialogClose: PropTypes.func,
    styleClass: PropTypes.string,
    isAlertDialog: PropTypes.bool,
    fullScreen:PropTypes.bool
}

MaterialDialog.defaultProps = {
    isOpen: false,
    dialogTitle: '',
    onDialogClose: () => { },
    styleClass: '',
    isAlertDialog: false,
    fullScreen:false
}

export default MaterialDialog;