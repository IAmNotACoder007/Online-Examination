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
import ErrorIcon from '@material-ui/icons/ErrorOutline';
import ClearIcon from '@material-ui/icons/Clear';
import WarningIcon from '@material-ui/icons/Warning';
import { subscribeToEvent, emitEvent } from '../../Api';
import { NotificationManager } from 'react-notifications';

class AddQuestions extends Component {
    constructor(props) {
        super(props);
        this.selectedDepartment = undefined;
        this.questionsErrorMessage = undefined;
        this.answersErrorMessage = undefined;
        this.questions = [];
        this.options = [];
        this.disableContinueButton = false;
        this.correctOptions = [];


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
            this.selectedDepartment = this.state.departments[val - 1];
        }

        this.handleChange = (fieldName, val) => {
            const name = `hasValid${fieldName}`;
            if (val && val.trim()) {
                this.setState({ [name]: true });
            }
        }

        this.showPreview = () => {
            if (!this.state.uploadFile) {
                let questions = document.getElementById('exam-questions').value.trim();
                questions = questions ? questions.split(/\n/) : undefined;
                let answers = document.getElementById('exam-options').value.trim();
                answers = answers ? answers.split(/\n/) : undefined;
                if (this.hasValidMembers(questions, answers)) {
                    this.questions = questions;
                    this.options = answers;
                    this.setState({ showPreview: true });
                }

            } else {
                const fileName = document.getElementById("html-upload").value;
                if (fileName && this.isExcelFile(fileName)) {
                    this.setState({ showPreview: true });
                } else {
                    this.setState({ showWarning: true });
                }
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
                    var workbook = XLSX.read(binary, { type: 'binary', cellDates: true, cellStyles: true });
                    this.fillQuestionsOptions(workbook);
                };
                fileReader.readAsArrayBuffer(file);
            } else {
                this.setState({ showWarning: true });
            }
        }

        this.fillQuestionsOptions = (workbook) => {
            this.questions = [];
            this.options = [];
            this.correctOptions = [];
            const jsonData = this.to_json(workbook)
            Object.keys(jsonData).forEach((key) => {
                var columns = jsonData[key];
                columns.forEach((column) => {
                    const question = column[Object.keys(column).find(key => key.toLowerCase() === "questions")];
                    const option = column[Object.keys(column).find(key => key.toLowerCase() === "options")];
                    const correctOption = column[Object.keys(column).find(key => key.toLowerCase() === "correctoption")];
                    if (question)
                        this.questions.push(question);
                    if (option)
                        this.options.push(option);
                    if (correctOption)
                        this.correctOptions.push(correctOption);
                });
            });


        }

        this.to_json = (workbook) => {
            if (workbook.SSF) XLSX.SSF.load_table(workbook.SSF);
            let result = {};
            workbook.SheetNames.forEach(function (sheetName) {
                let roa = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
                if (roa.length > 0) result[sheetName] = roa;
            });
            return result;
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
                        <ErrorIcon style={{ height: "60px", width: '60px' }} color="error" />
                        Please upload an Excel file
                </div>
                )
            } else if (this.state.showPreview) {
                return (
                    <div className="preview-container">
                        {this.getPreviewJsx()}
                    </div>
                )
            }
        }

        this.getOptionsPreviewJsx = (options) => {
            if (!options) return;
            return (
                <div style={{ paddingLeft: "14px" }}>
                    {options.split(',').map((option) => {
                        return (
                            <div>{option}</div>
                        )
                    })}
                </div>
            )
        }

        this.getPreviewJsx = () => {
            if (this.questions && this.questions.length) {
                return (this.questions.map((ques, index) => {
                    return (
                        <div style={{ paddingBottom: '12px' }}>
                            <div className="question"><b>Question:</b><text style={{ paddingLeft: "5px" }}>{ques}</text></div>
                            <div className="options"><b>Options:</b> {this.getOptionsPreviewJsx(this.options[index])}</div>
                            <br />
                            <div className="correct-option"><b>Correct Option:</b><div style={{ paddingLeft: "5px" }}>{this.correctOptions[index]}</div> </div>
                        </div>
                    )
                }))
            } else {
                this.disableContinueButton = true;
                return (<div className="preview-error-msg">
                    <WarningIcon style={{ height: "60px", width: '60px' }} color="error" />
                    No Data Found</div>)
            }
        }

        this.getDialogButtons = () => {
            if (this.state.showWarning) {
                return (
                    <ActionButton flatButton={true} text="Ok" onClick={() => { this.setState({ showWarning: false }) }} />
                )
            } else if (this.state.showPreview) {
                return (
                    <div>
                        <ActionButton disabled={this.disableContinueButton} flatButton={true} text="Continue" onClick={this.updateQuestionOptions} />
                        <ActionButton flatButton={true} text="Cancel" onClick={() => { this.disableContinueButton = false; this.setState({ showPreview: false }) }} />
                    </div>
                )
            }
        }

        this.updateQuestionOptions = () => {
            const data = { organizationId: this.props.organizationId, questions: this.questions, options: this.options, correctOptions: this.correctOptions, department: (this.selectedDepartment || this.state.departments[0]) }
            emitEvent("addQuestionAndOptions", data);
            this.setState({ showPreview: false });
            subscribeToEvent("questionsAddedSuccessfully", () => {
                NotificationManager.success('Questions Saved.', 'Success');
            })


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
                        <ActionButton size="large" text="Save" onClick={this.showPreview} />
                    </footer>
                </div>
            )
        }
    }
    render() {
        const dialogClass = this.showWarning ? "preview-error-dialog" : "preview-dialog"
        return (
            <div className="exam-add-question-page" style={{ "padding-top": "25px" }}>
                <header className="add-question-header">
                    <text>Select Department:</text>
                    <ComboBox items={this.state.departments} onChange={this.onComboValueChange} />
                </header>
                <main>
                    <PaperSheet content={this.getPaperContent()} />
                </main>
                <MaterialDialog styleClass={dialogClass} isOpen={this.state.showWarning || this.state.showPreview} dialogTitle={this.state.showWarning ? "Error" : "Preview"} dialogContent={this.getDialogContent()} dialogButtons={this.getDialogButtons()} />

            </div>
        )
    }

    componentDidMount() {
        fetch("http://localhost:8080/getDepartments")
            .then(res => res.json())
            .then((departments) => {
                this.setState({ departments: Object.keys(departments).length !== 0 ? departments.map(department => department.department_name) : [] });
            });
    }
}



export default AddQuestions
