import React, { Component } from 'react';
import Departments from '../common/Departments';
import PaperSheet from '../../material_components/PaperSheet';
import '../../styles/admin/UpdateQuestionsOptions.css';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import TextBox from '../../material_components/TextBox';
import RemoveCircle from '@material-ui/icons/Clear';
import { subscribeToEvent, emitEvent } from '../../Api';
import uuid from 'uuid/v4';
import DeleteAction from '../common/DeleteAction'
import EditAction from '../common/EditAction'

class UpdateQuestionsOptions extends Component {
    constructor(props) {
        super(props);
        subscribeToEvent("refreshQuestionOption", (data) => {
            this.setState({ questionsAndOptions: JSON.parse(data) });
        });
    }
    initialState = {               
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
    currentDepartment = undefined;
    addNewOptionButton = [{
        text: "Add Option", onClick: () => {
            this.addNewOption();
        }
    }];

    getView() {
        return (
            <div>
                <header className="update-questions-header">
                    <text style={{ paddingRight: '10px' }}>Select Department:</text>
                    <Departments organizationId={this.props.organizationId} onChange={this.getQuestionsOptionsForDepartment} />
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
        this.setState({ editingId: info.id, editingQuestion: info.questions, editingOptions: editingOptions });
    }
    getEditDialogContent = () => {
        return (<div className="edit-question-options-form">
            <TextBox error={this.state.hasInvalidQuestion} errorMessage={this.questionErrorMessage} label="Question" fullWidth={true} key={this.state.editingId} id="edited-question" fieldName="editingQuestion" defaultValue={this.state.editingQuestion} onChange={this.updateQuestion} />

            {this.state.editingOptions.map((option, index) => {
                return (<div key={Object.keys(option)[0]} style={{ display: 'flex', alignItems: "center" }}><div style={{ flex: 1 }}><TextBox fullWidth={true} error={this.state[Object.keys(option)[0]] || false} errorMessage={this.optionsErrorMessage} label={"Option" + (index + 1)} id={Object.keys(option)[0]} fieldName={Object.keys(option)[0]} defaultValue={Object.values(option)[0]} onChange={this.updateOptionValue} /></div>
                    <Tooltip title="Remove Option">
                        <IconButton onClick={() => { this.removeOption(Object.keys(option)[0]); } }>
                            <RemoveCircle color="Error" /></IconButton>
                    </Tooltip></div>);
            })}
        </div>);
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

    updateQuestionOptions = () => {
        if (this.hasValidOptions() && this.hasValidQuestion()) {
            if (this.originalQuestion !== this.state.editingQuestion || this.originalOptions !== this.state.editingOptions) {
                const options = this.state.editingOptions.map((option) => {
                    return Object.values(option)[0];
                }).join(',');
                emitEvent("updateQuestionOptions", { departmentName: this.currentDepartment, id: this.state.editingId, question: this.state.editingQuestion, options: options });
            }
            this.setState(this.initialState);
            return true;      
        }
        return false;
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
            return Object.keys(option)[0] !== id
        });
        this.setState({ editingOptions: options })
    }
    
    deleteQuestion = (id) => {
        emitEvent("deleteQuestion", { id: id, departmentName: this.currentDepartment });        
    }


    getQuestionsOptionsJsx = () => {
        if (this.state.questionsAndOptions && this.state.questionsAndOptions.length) {
            return ((this.state.questionsAndOptions).map((qusOption) => {
                return (
                    <div key={qusOption.id} className='question-options-row'>
                        <div className="question"><Tooltip title={qusOption.questions}>
                            <text>{qusOption.questions}</text>
                        </Tooltip>
                        </div>
                        <div className="option">
                            {qusOption.options.split(',').map((option) => {
                                return (<Tooltip key={option} title={option}><text>{option}</text></Tooltip>)
                            })}
                        </div>
                        <div className="icons" style={{ width: '100px', minWidth: '100px', display: 'flex' }}>
                            <EditAction dialogClass="edit-question-options-dialog" onSave={this.updateQuestionOptions} contentSource={this.getEditDialogContent} onOpen={() => { this.editQuestionsOptions(qusOption) }} extraButtons={this.addNewOptionButton} />
                            <DeleteAction onDelete={() => { this.deleteQuestion(qusOption.id) }} />
                        </div>
                    </div>
                )
            }))
        } else {
            return (
                <div className="no-data-found" style={{minHeight:'200px'}}>No Data Found</div>
            )
        }
    }

    getQuestionsOptionsForDepartment = (val) => {
        this.currentDepartment = val;
        fetch(`http://localhost:8080/getQuestionsOptionsForDepartments?departmentName=${val}`).then((response) => response.json())
            .then((data) => {
                this.setState({ questionsAndOptions: data });
            });
    }   

    render() {

        return (
            <div className="update-questions-options-container">
                {this.getView()}              
            </div>
        )
    }
}

export default UpdateQuestionsOptions;

