import React, { Component } from 'react';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Departments from '../common/Departments';
import { NotificationManager } from 'react-notifications';
import PaperSheet from '../../material_components/PaperSheet';
import '../../styles/admin/UpdateQuestionsOptions.css';
import Tooltip from '@material-ui/core/Tooltip';

class UpdateQuestionsOptions extends Component {
    state = {
        questionsAndOptions: []
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
            </div>
        )
    }
}

export default UpdateQuestionsOptions;

