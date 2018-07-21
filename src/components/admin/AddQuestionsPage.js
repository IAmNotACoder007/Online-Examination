import React, { Component } from 'react';
import ComboBox from '../../material_components/ComboBox';
import '../../styles/admin/AddQuestionsPage.css'
import PaperSheet from '../../material_components/PaperSheet';
import TextBox from '../../material_components/TextBox';
import ActionButton from '../../material_components/ActionButton';
import MaterialCheckBox from '../../material_components/MaterialCheckBox';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Button from '@material-ui/core/Button';
import XLSX from 'xlsx';
import MaterialDialog from '../../material_components/Dialog'
import WarningIcon from '@material-ui/icons/Warning';
import ClearIcon from '@material-ui/icons/Clear';

class AddQuestions extends Component {
    constructor(props) {
        super(props);
        this.selectedDepartment = undefined;
        this.questionsErrorMessage = undefined;
        this.answersErrorMessage = undefined;
        this.questions = [];
        this.options = [];


        this.state = {
            departments: [],
            uploadFile: false,
            hasValidQuestions: true,
            hasValidAnswers: true,
            showWarning: false,
            fileName: '',
            showPreview: false
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
            } else {
                this.setState({ showPreview: true });
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
                    return questions.indexOf(member) !== i
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
        this.uploadFile = () => {
            document.getElementById("html-upload").click();
        }

        this.handleFileUpload = (event) => {
            const file = event.target.files[0];
            if (file && this.isExcelFile(file.name)) {
                var fileReader = new FileReader();
                fileReader.onload = (e) => {
                    this.setState({ fileName: file.name });
                    // pre-process data
                    var binary = "";
                    var bytes = new Uint8Array(e.target.result);
                    var length = bytes.byteLength;
                    for (var i = 0; i < length; i++) {
                        binary += String.fromCharCode(bytes[i]);
                    }
                    // call 'xlsx' to read the file
                    var oFile = XLSX.read(binary, { type: 'binary', cellDates: true, cellStyles: true });
                    this.fillQuestionsOptions(oFile.Strings);
                };
                fileReader.readAsArrayBuffer(file);
            } else {
                this.setState({ showWarning: true });
            }
        }

        this.fillQuestionsOptions = (quesOpt) => {
            this.questions = [];
            this.answers = [];
            if (quesOpt && quesOpt.length) {
                for (let i = 0; i < quesOpt.length; i++) {
                    if (i === 0 || i % 2 === 0)
                        this.questions.push(quesOpt[i].t);
                    else
                        this.options.push(quesOpt[i].t)
                }
            }
        }

        this.isExcelFile = (filename) => {
            if (!filename) return false;
            let extensions = filename.substring(filename.lastIndexOf('.') + 1);
            return extensions === "xls" || extensions === "xlsx"
        }

        this.getDialogContent = () => {
            if (this.state.showWarning) {
                return (
                    <div className="warning-message">
                        <WarningIcon style={{ height: "60px", width: '60px' }} color="error" />
                        Please upload an Excel file
                </div>
                )
            } else if (this.state.showPreview) {
                return (
                    <div className="preview-container">
                        {this.questions.map((ques, index) => {
                            return (
                                <div style={{ paddingBottom: '12px' }}>
                                    <div className="question"><b>Question:</b><text style={{ paddingLeft: "5px" }}> {ques}</text></div>
                                    <div className="options"><b>Options:</b> {this.getOptionsPreviewJsx(this.options[index])}</div>
                                </div>
                            )
                        })}
                    </div>
                )
            }
        }

        this.getOptionsPreviewJsx = (options) => {
            if (!options) return;
            return (
                <div style={{ paddingLeft: "10px" }}>
                    {options.split(',').map((option) => {
                        return (
                            <div>{option}</div>
                        )
                    })}
                </div>
            )
        }

        this.getDialogButtons = () => {
            if (this.state.showWarning) {
                return (
                    <ActionButton flatButton={true} text="Ok" onClick={() => { this.setState({ showWarning: false }) }} />
                )
            } else if (this.state.showPreview) {
                return (
                    <div>
                        <ActionButton flatButton={true} text="Continue" onClick={() => { this.setState({ showPreview: false }) }} />
                        <ActionButton flatButton={true} text="Cancel" onClick={() => { this.setState({ showPreview: false }) }} />
                    </div>
                )
            }
        }

        this.resetFile = () => {
            this.options = [];
            this.questions = [];
            document.getElementById("html-upload").value = "";
            this.setState({ fileName: '' });
        }

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
                            <div className="upload-container">
                                <Button onClick={this.uploadFile} disabled={!this.state.uploadFile} variant="raised" color="default">
                                    Upload
                                <CloudUploadIcon />
                                </Button>
                                <text className='file-name'>{this.state.fileName}
                                </text>
                                <ClearIcon className="clear-icon" onClick={this.resetFile} color="colorError" style={{ display: this.state.fileName ? 'inline-block' : 'none', height: '18px', width: '18px' }} />
                            </div>
                            <input type="file" id="html-upload" onChange={this.handleFileUpload} style={{ display: 'none' }} />
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
                <MaterialDialog isOpen={this.state.showWarning || this.state.showPreview} dialogTitle={this.state.showWarning ? "Warning" : "Preview"} dialogContent={this.getDialogContent()} dialogButtons={this.getDialogButtons()} />

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
