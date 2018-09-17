import React, { Component } from 'react';
import Departments from '../common/Departments';
import TextBox from '../../material_components/TextBox';
import ActionButton from '../../material_components/ActionButton';
import Snackbar from '@material-ui/core/Snackbar';
import CloseIcon from '@material-ui/icons/Close';
import PaperSheet from '../../material_components/PaperSheet';
import CheckBox from '../../material_components/MaterialCheckBox';
import '../../styles/users/Exam.css';
import Enumerable from 'linq';

class ExamsDetails extends Component {
    defaultState = {
        selectedDepartmet: "",
        open: false,
        studentsDetail: [],
        recordToshow: [],
        hideDuplicateRecords: false
    }

    state = { ...this.defaultState }

    onDepartmentChange = (name) => {
        const url = `${window.location.origin}/exam?departmentName=${name}&orgId=${this.props.organizationId}`
        document.getElementById("examUrl").value = url;
        this.setState({ selectedDepartmet: name }, () => {
            this.refreshStudentsDetail()
        });
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

    onChange = (name, ischecked) => {
        let recordToshow = [];
        if (ischecked) {
            const uniqueStudentids = Array.from(new Set(this.state.studentsDetail.map((data) => {
                return data.student_id;
            })));
            if (this.state.studentsDetail.length === uniqueStudentids.length) {
                recordToshow = this.state.studentsDetail;
            } else {
                uniqueStudentids.forEach(id => {
                    const records = Enumerable.from(this.state.studentsDetail).where(i => i.student_id === id).toArray();
                    const latestRecordDate = Math.max.apply(null, records.map((data) => {
                        return new Date(data.exam_date);
                    }));
                    recordToshow.push(Enumerable.from(this.state.studentsDetail).where(t => new Date(t.exam_date).getTime() === new Date(latestRecordDate).getTime()).firstOrDefault());
                });
            }
        } else {
            recordToshow = this.state.studentsDetail;
        }
        this.setState({ hideDuplicateRecords: ischecked, recordToshow: recordToshow })
    }
    render() {
        return (
            <div className="exam-details-holder" style={{ height: 'calc(100% - 50px)' }}>
                <div style={{ display: 'flex', alignItems: 'center', paddingTop: '10px' }}>
                    <text style={{ paddingRight: '10px' }}>Select Department:</text>
                    <Departments onChange={this.onDepartmentChange} organizationId={this.props.organizationId}></Departments>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <TextBox className="exam-url" disabled={true} id="examUrl" fieldName="examUrl" fullWidth={true} label="Exam Url"></TextBox>
                    <ActionButton styles={{ height: '40px', marginLeft: '10px' }} text="Copy Url" onClick={this.copyUrl} flatButton={true}></ActionButton>
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
                        message={<span id="message-id">Copied to clipboard!</span>}
                        action={[
                            <CloseIcon onClick={this.handleClose} />
                        ]}
                    />
                </div>
                <div className="hide-duplicate-record-cb-container">
                    <CheckBox disabled={this.state.studentsDetail.length <= 0} checked={this.state.hideDuplicateRecords} onChange={this.onChange} label="Hide Duplicate Record"></CheckBox>
                </div>
                <PaperSheet content={this.getView()}></PaperSheet>
            </div>
        )
    }

    getView() {
        if (this.state.recordToshow && this.state.recordToshow.length) {
            return this.state.recordToshow.map((detail) => {
                return (
                    <div className="students-details" key={detail.id}>
                        <text className="student-name">{detail.student_name}</text>
                        <time>{this.getFormattedDateTimeString(detail.exam_date)}</time>
                        <text>{detail.total_marks}/{detail.out_of}</text>
                        <a className="send-email-link">Send Email</a>
                    </div>
                )
            });
        } else {
            return (
                <div className="no-data-found">No Data Found</div>
            )
        }
    }


    getFormattedDateTimeString(date) {
        if (!date) return '';
        const dateObject = new Date(date);
        const hours = dateObject.getHours();
        const minutes = dateObject.getMinutes();
        const seconds = dateObject.getSeconds();
        return `${dateObject.toLocaleDateString('en-US')} ${hours}:${minutes}:${seconds}`
    }

    refreshStudentsDetail() {
        fetch(`http://localhost:8080/getStudentsResultForOrganization?departmentName=${this.state.selectedDepartmet}&organizationId=${this.props.organizationId}`).then((response) => response.json())
            .then((data) => {
                this.setState({ studentsDetail: data, recordToshow: data });
            });
    }
}

export default ExamsDetails;