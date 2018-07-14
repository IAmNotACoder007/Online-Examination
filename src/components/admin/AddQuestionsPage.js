import React, { Component } from 'react';
import ComboBox from '../../material_components/ComboBox';
import '../../styles/admin/AddQuestionsPage.css'

class AddQuestions extends Component {
    constructor(props) {
        super(props);
        this.selectedDepartment = undefined;
        this.state = {
            departments: [],
        }

        this.onComboValueChange = (val) => {
            this.selectedDepartment = val;
        }
    }
    render() {
        return (
            <div className="exam-add-question-page" style={{ "padding-top": "25px" }}>
                <header className="add-question-header">
                    <text>Select Department:</text>
                    <ComboBox items={this.state.departments} onChange={this.onComboValueChange} />
                </header>
            </div>
        )
    }

    componentDidMount() {
        fetch("http://localhost:8080/getDepartments")
            .then(res => res.json())
            .then((departments) => {
                this.setState({ departments: departments.map(department => department.department_name) });
            });
    }
}



export default AddQuestions
