import React, { Component } from 'react';
import Departments from '../common/Departments';
import ActionButton from '../../material_components/ActionButton'
import { Redirect } from 'react-router-dom';
import '../../styles/users/SelectExamStyle.css'

class SelectExam extends Component {
    state = {
        startExam: false
    }

    selectedDepartment = undefined;
    redirectTo = undefined;

    startExam = () => {
        this.redirectTo = new URL(`${window.location.origin}/exam?departmentName=${this.selectedDepartment}`);
        this.setState({ startExam: true })
    }
    onChange = (department) => {
        this.selectedDepartment = department;
    }
    render() {
        if (this.state.startExam) {
            return <Redirect to={{
                pathname: this.redirectTo.pathname,
                search: this.redirectTo.search
            }} push={true} />
        }
        return (
            <div className="select-exam-container">
                <content className="select-exam-content">
                    <div className="select-exam-combo">
                        <text className="text" style={{ paddingRight: '10px' }}>Select Exam For:</text>
                        <Departments onChange={this.onChange} />
                    </div>
                    <ActionButton size="large" flatButton={true} text="Proceed" onClick={this.startExam} />
                </content>
            </div>
        )
    }
}

export default SelectExam;