import React, { Component } from 'react';
import ComboBox from '../../material_components/ComboBox';
import '../../styles/admin/AddQuestionsPage.css'
import PaperSheet from '../../material_components/PaperSheet';
import TextBox from '../../material_components/TextBox';
import ActionButton from '../../material_components/ActionButton';
import MaterialCheckBox from '../../material_components/MaterialCheckBox';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Button from '@material-ui/core/Button';

class AddQuestions extends Component {
    constructor(props) {
        super(props);
        this.selectedDepartment = undefined;
        this.state = {
            departments: [],
            uploadFile: false
        }

        this.onComboValueChange = (val) => {
            this.selectedDepartment = val;
        }
        this.save = () => {

        }

        this.handleCheckboxChange = (name, isChecked) => {
            this.setState({ [name]: isChecked });
        };
        this.getPaperContent = () => {
            return (
                <div className="exam-add-question-paper-sheet">
                    <content className="exam-add-question-content">
                        <section className="left-side">
                            <TextBox id="exam-questions" rows="8" fieldName="questions" multiline={true} label="Questions" placeholder="Put One Question Per Line" />
                            <TextBox id="exam-options" rows="8" fieldName="options" multiline={true} label="Options" placeholder="Put Options Separated By Comma" />
                        </section>
                        <div className="separator">or</div>
                        <section className="right-side">
                            <MaterialCheckBox checked={this.state.uploadFile} onChange={this.handleCheckboxChange} label="Upload Excel File" value="uploadFile" />
                            <Button disabled={!this.state.uploadFile} variant="raised" color="default">
                                Upload
                                <CloudUploadIcon />
                            </Button>
                        </section>
                    </content>
                    <footer className="exam-add-question-footer">
                        <ActionButton size="large" text="Save" onClick={this.save} />
                    </footer>
                </div>
            )
        }
    }
    render() {
        return (
            <div className="exam-add-question-page" style={{ "padding-top": "25px" }}>
                <header className="add-question-header">
                    <text>Select Department:</text>
                    <ComboBox items={this.state.departments} onChange={this.onComboValueChange} />
                </header>
                <main>
                    <PaperSheet content={this.getPaperContent()} />
                </main>
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
