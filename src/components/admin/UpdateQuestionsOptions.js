import React, { Component } from 'react';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Departments from '../common/Departments';
import { NotificationManager } from 'react-notifications';
import PaperSheet from '../../material_components/PaperSheet';
import '../../styles/admin/UpdateQuestionsOptions.css';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import MaterialDialog from '../../material_components/Dialog';
import TextBox from '../../material_components/TextBox';
import ActionButton from '../../material_components/ActionButton';
import RemoveCircle from '@material-ui/icons/Clear';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import { subscribeToEvent, emitEvent } from '../../Api';
import uuid from 'uuid/v4';

class UpdateQuestionsOptions extends Component {
    initialState = {
        openEditDialog: false,
        openAlertDialog: false,
        editingId: '',
        editingQuestion: '',
        editingOptions: [],
        hasInvalidQuestion: false,
    }
    state = {
        ...this.initialState,
        questionsAndOptions: []
    };

    originalQuestion = undefined;
    originalOptions = undefined;
    optionsErrorMessage = "Options must be specified";
    questionErrorMessage = "Question must be specified";

    getView() {
        return (
            <div>
                <header className="update-questions-header">
                    <text style={{ paddingRight: '10px' }}>Select Department:</text>
                    <Departments onChange={this.getQuestionsOptionsForDepartment} />
                </header>
                <content>
                    <PaperSheet classes="update-questions-options-paper" content={this.getQuestionsOptionsJsx()} />
                </content>
            </div>
        )
    }

    editQuestionsOptions = (info) => {
        this.originalOptions = info.options;
        this.originalQuestion = info.questions;
        let editingOptions = [];
        info.options.split(',').forEach(element => {
            editingOptions.push({ [uuid()]: element })
        });
        this.setState({ openEditDialog: true, editingId: info.id, editingQuestion: info.questions, editingOptions: editingOptions });
    }
    getDialogContent = () => {
        if (this.state.openEditDialog) {
            return (
                <div className="edit-question-options-form">
                    <TextBox error={this.state.hasInvalidQuestion} errorMessage={this.questionErrorMessage} label="Question" fullWidth={true} key={this.state.editingId} id="edited-question" fieldName="editingQuestion" defaultValue={this.state.editingQuestion} onChange={this.updateQuestion} />

                    {this.state.editingOptions.map((option, index) => {
                        return (<div key={Object.keys(option)[0]} style={{ display: 'flex', alignItems: "center" }}><div style={{ flex: 1 }}><TextBox fullWidth={true} error={this.state[Object.keys(option)[0]] || false} errorMessage={this.optionsErrorMessage} label={"Option" + (index + 1)} id={Object.keys(option)[0]} fieldName={Object.keys(option)[0]} defaultValue={Object.values(option)[0]} onChange={this.updateOptionValue} /></div>
                            <Tooltip title="Remove Option">
                                <IconButton onClick={() => { this.removeOption(Object.keys(option)[0]) }}>
                                    <RemoveCircle color="Error" /></IconButton>
                            </Tooltip></div>
                        )
                    })}
                </div>
            )
        }
    }

    closeDialog = () => {
        this.setState(this.initialState);
    }

    updateOptionValue = (id, val) => {
        let options = this.state.editingOptions.map((option) => {
            if (Object.keys(option)[0] === id) return { [Object.keys(option)[0]]: val };
            else return option;
        });
        const isValid = val ? true : false;
        this.setState({ editingOptions: options, [id]: !isValid });
    }

    updateQuestion = (name, val) => {
        const hasInvalidQuestion = !val ? true : false;
        this.setState({ [name]: val, hasInvalidQuestion: hasInvalidQuestion });
    }

    getDialogButtons = () => {
        if (this.state.openEditDialog) {
            return (
                <div className="edit-buttons">
                    <ActionButton text="Add Option" flatButton={true} onClick={this.addNewOption} />
                    <ActionButton text="Save" flatButton={true} onClick={this.updateQuestionOptions} />
                    <ActionButton text="Cancel" flatButton={true} onClick={this.closeDialog} />
                </div>
            )
        }
    }

    updateQuestionOptions = () => {
        if (this.hasValidOptions() && this.hasValidQuestion()) {
            if (this.originalQuestion != this.state.editingQuestion || this.originalOptions != this.state.editingOptions) {
                emitEvent("updateQuestionOptions", {});
            }
            this.setState({ openEditDialog: false });
        }
    }

    hasValidOptions = () => {
        const invalidOptions = this.state.editingOptions.filter((option) => {
            if (!(Object.values(option)[0])) return option;
        });
        if (invalidOptions.length) {
            invalidOptions.forEach(id => {
                this.setState({ [Object.keys(id)[0]]: true })
            });
            return false;
        }

        return true;
    }

    hasValidQuestion = () => {
        if (!this.state.editingQuestion) {
            this.questionErrorMessage = "Question must be specified";
            this.setState({ hasInvalidQuestion: true });
            return false;
        } else if (!this.state.editingOptions.length) {
            this.questionErrorMessage = "At least one option required";
            this.setState({ hasInvalidQuestion: true });
            return false;
        }
        return true;
    }

    addNewOption = () => {
        let options = this.state.editingOptions;
        options.push({ [uuid()]: "" });
        this.setState({ editingOptions: options })
    }

    removeOption = (id) => {
        let options = this.state.editingOptions.filter((option) => {
            return Object.keys(option)[0] != id
        });
        this.setState({ editingOptions: options })
    }

    getQuestionsOptionsJsx = () => {
        if (this.state.questionsAndOptions && this.state.questionsAndOptions.length) {
            return ((this.state.questionsAndOptions).map((qusOption) => {
                return (
                    <div className='question-options-row'>
                        <div className="question"><Tooltip title={qusOption.questions}>
                            <text>{qusOption.questions}</text>
                        </Tooltip>
                        </div>
                        <div className="option">
                            {qusOption.options.split(',').map((option) => {
                                return (<Tooltip title={option}><text>{option}</text></Tooltip>)
                            })}
                        </div>
                        <div className="icons" style={{ width: '100px', minWidth: '100px' }}>
                            <IconButton onClick={() => { this.editQuestionsOptions(qusOption) }}>
                                <EditIcon />
                            </IconButton>
                            <IconButton onClick={this.addNewOption}>
                                <DeleteIcon />
                            </IconButton>
                        </div>
                    </div>
                )
            }))
        } else {
            return (
                <div>No Data Found</div>
            )
        }
    }

    getQuestionsOptionsForDepartment = (val) => {
        fetch(`http://localhost:8080/getQuestionsOptionsForDepartments?departmentName=${val}`).then((response) => response.json())
            .then((data) => {
                this.setState({ questionsAndOptions: data });
            });
    }

    render() {
        return (
            <div className="update-questions-options-container">
                {this.getView()}
                <MaterialDialog styleClass="edit-question-options-dialog" isOpen={this.state.openEditDialog} dialogContent={this.getDialogContent()} dialogButtons={this.getDialogButtons()} />
            </div>
        )
    }
}

export default UpdateQuestionsOptions;

