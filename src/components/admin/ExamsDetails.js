import React, { Component } from 'react';
import Departments from '../common/Departments';
import TextBox from '../../material_components/TextBox';
import ActionButton from '../../material_components/ActionButton';
import Snackbar from '@material-ui/core/Snackbar';
import CloseIcon from '@material-ui/icons/Close';

class ExamsDetails extends Component {
    defaultState = {
        selectedDepartmet: "",
        open: false
    }

    state = { ...this.defaultState }
    onDepartmentChange = (name) => {
        const url = `${window.location.origin}/exam?departmentName=${name}&orgId=${this.props.organizationId}`
        document.getElementById("examUrl").value = url;
        this.setState({ selectedDepartmet: name });
    }
    handleClose = () => {
        this.setState({ open: false });
    }
    copyUrl = () => {
        var copyUrl = document.getElementById('examUrl').value;
        const el = document.createElement('textarea');
        el.value = copyUrl
        el.setAttribute('readonly', '');
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        document.body.appendChild(el);
        el.focus();
        el.select();

        try {
            var successful = document.execCommand('copy');
            var msg = successful ? 'successful' : 'unsuccessful';
            document.body.removeChild(el);
            this.setState({ open: true });
            console.log('Copying text command was ' + msg);
        } catch (err) {
            console.log('Oops, unable to copy');
        }
    }
    render() {
        return (
            <div>
                <Departments onChange={this.onDepartmentChange} organizationId={this.props.organizationId}></Departments>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <TextBox disabled={true} id="examUrl" fieldName="examUrl" fullWidth={true} label="Exam Url"></TextBox>
                    <ActionButton styles={{ height: '40px', marginLeft: '10px' }} text="Copy" onClick={this.copyUrl} flatButton={true}></ActionButton>
                    <Snackbar
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                        open={this.state.open}
                        autoHideDuration={6000}
                        onClose={this.handleClose}
                        ContentProps={{
                            'aria-describedby': 'message-id',
                        }}
                        message={<span id="message-id">Copied!</span>}
                        action={[
                            <CloseIcon onClick={this.handleClose} />
                        ]}
                    />
                </div>
            </div>
        )
    }
}

export default ExamsDetails;