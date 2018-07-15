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
        this.questionsErrorMessage = undefined;
        this.answersErrorMessage = undefined;

        this.state = {
            departments: [],
            uploadFile: false,
            hasValidQuestions: true,
            hasValidAnswers: true,
        }

        this.onComboValueChange = (val) => {
            this.selectedDepartment = val;
        }

        this.handleChange = (fieldName, val) => {
            const name = `hasValid${fieldName}`;
            if (val && val.trim()) {
                this.setState({ [name]: true });
            }
        }
        this.saveQuestions = () => {
            if (!this.state.uploadFile) {
                let questions = document.getElementById('exam-questions').value.trim();
                questions = questions ? questions.split(/\n/) : undefined;
                let answers = document.getElementById('exam-options').value.trim();
                answers = answers ? answers.split(/\n/) : undefined;
                if (this.hasValidMembers(questions, answers)) { }
            }
        }

        this.hasValidMembers = (questions, answers) => {
            let isValid = true;
            if (!questions || !questions.length) {
                this.questionsErrorMessage = "Questions must be specified";
                this.setState({ hasValidQuestions: false });
                isValid = false;
            }
            if (!answers || !answers.length) {
                this.answersErrorMessage = "Answers must be specified";
                this.setState({ hasValidAnswers: false });
                isValid = false;
            }

            if (Array.isArray(questions)) {
                const hasDuplicateQuestions = questions.some((member, i) => {
                    return questions.indexOf(member) != i
                });

                if (hasDuplicateQuestions) {
                    this.questionsErrorMessage = "Questions must be unique";
                    this.setState({ hasValidQuestions: false });
                    isValid = false;
                }
            }
            return isValid;
        }

        this.handleCheckboxChange = (name, isChecked) => {
            this.setState({ [name]: isChecked });
        };
        this.getPaperContent = () => {
            return (
                <div className="exam-add-question-paper-sheet">
                    <content className="exam-add-question-content">
                        <section className="left-side">
                            <TextBox onChange={this.handleChange} errorMessage={this.questionsErrorMessage} error={!this.state.hasValidQuestions} id="exam-questions" rows="6" fieldName="Questions" multiline={true} label="Questions" placeholder="Put One Question Per Line" />
                            <TextBox onChange={this.handleChange} errorMessage={this.answersErrorMessage} error={!this.state.hasValidAnswers} id="exam-options" rows="6" fieldName="Answers" multiline={true} label="Options" placeholder="Put Options Separated By Comma" />
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
                        <ActionButton size="large" text="Save" onClick={this.saveQuestions} />
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
