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

class UpdateQuestionsOptions extends Component {
    state = {
        questionsAndOptions: [],
        openEditDialog: false,
        openAlertDialog: false,
        editingId: '',
        editingQuestion: '',
        editingOptions: []
    }

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
        this.setState({ openEditDialog: true, editingId: info.id, editingQuestion: info.questions, editingOptions: info.options.split(',') });
    }
    getDialogContent = () => {
        if (this.state.openEditDialog) {
            return (
                <div className="edit-question-options-form">
                    <TextBox label="Question" fullWidth={true} id={this.state.id} fieldName="question" defaultValue={this.state.editingQuestion} />

                    {this.state.editingOptions.map((option, index) => {
                        return (<div style={{ display: 'flex', alignItems: "center" }}><TextBox fullWidth={true} label={"Option" + (index + 1)} id={this.state.editingId} fieldName="options" defaultValue={option} />
                            <Tooltip title="Remove Option">
                                <IconButton onClick={() => { this.removeOption(index) }}>
                                    <RemoveCircle color="Error" /></IconButton>
                            </Tooltip></div>
                        )
                    })}                   
                </div>
            )
        }
    }

    closeDialog = () => {
        this.setState({ openAlertDialog: false, openEditDialog: false, editingId: '', editingOptions: [], editingQuestion: '' });
    }

    getDialogButtons = () => {
        if (this.state.openEditDialog) {
            return (
                <div className="edit-buttons">
                <ActionButton text="Add Option" flatButton={true} onClick={this.addNewOption} />
                    <ActionButton text="Save" flatButton={true} onClick={this.closeDialog} />
                    <ActionButton text="Cancel" flatButton={true} onClick={this.closeDialog} />
                </div>
            )
        }
    }

    addNewOption = () => {
        let options = this.state.editingOptions;
        options.push("");
        this.setState({ editingOptions: options })
    }

    removeOption = (index) => {
        let options = this.state.editingOptions;
        options.splice(index, 1);
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

