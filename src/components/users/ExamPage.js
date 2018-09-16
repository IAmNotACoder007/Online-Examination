import React, { Component } from 'react';
import queryString from 'query-string'
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import "../../styles/users/Exam.css";
import ActionButton from '../../material_components/ActionButton'
import Dialog from '../../material_components/Dialog'
import WarningIcon from '@material-ui/icons/Warning';
import Enumerable from 'linq';
import { emitEvent, subscribeToEvent } from '../../Api'
import { Redirect } from 'react-router-dom';

class Exam extends Component {
    constructor(props) {
        super(props);
        subscribeToEvent("resultUpdated", () => {
            this.setState({ redirectToThankyouPage: true })
        })
    }
    departmentName = undefined;
    questionsAndOptions = [];
    remainingQuestions = [];
    result = [];

    state = {
        questionsAndOptions: [],
        currentQuestionId: '',
        disableNextButton: false,
        disableBackButton: true,
        disableFinishButton: true,
        askConfirmation: false,
        noQuestionsFound: false,
        redirectToThankyouPage: false
    }

    handleChange = event => {
        this.setState({ selectedOption: event.target.value }, () => {
            this.updateResult();
        });
    };

    getRadioButtons = () => {
        const currentQuestion = this.questionsAndOptions.filter((question) => {
            if (question.id === this.state.currentQuestionId) return question
        })[0];
        if (currentQuestion) {
            return (
                <FormControl component="fieldset" className="radio-buttons-fieldset">
                    <FormLabel component="legend" className="question-legend">{currentQuestion.questions}</FormLabel>
                    <RadioGroup
                        aria-label={currentQuestion.questions}
                        name={currentQuestion.questions}

                        value={this.state.selectedOption}
                        onChange={this.handleChange}
                    >
                        {currentQuestion.options.split(',').map((option) => {
                            return (
                                <FormControlLabel value={option} key={currentQuestion.id} control={<Radio color="primary" />} label={option} />
                            )
                        })}
                    </RadioGroup>
                </FormControl>
            )
        }
    }

    getActionButtons = () => {
        if (this.questionsAndOptions.length) {
            return (
                <div className="buttons-container">
                    <ActionButton size="large" flatButton={true} disabled={this.state.disableNextButton} class="buttons" text="Next" onClick={this.nextQuestion} />
                    <ActionButton size="large" flatButton={true} disabled={this.state.disableBackButton} class="buttons" text="Back" onClick={this.previousQuestion} />
                    <ActionButton size="large" flatButton={true} disabled={this.state.disableFinishButton} class="buttons" text="Finish" onClick={() => { this.setState({ askConfirmation: true }) }} />
                </div>
            )
        }
    }

    nextQuestion = () => {
        const currentQuestionIndex = this.getCurrentQuestionIndex();
        const nextQuestion = this.questionsAndOptions.filter((question) => {
            if (question.id === this.result[currentQuestionIndex + 1].id) return question;
        })[0];

        this.setState({ currentQuestionId: nextQuestion.id, disableFinishButton: !this.isLastQuestion(), disableBackButton: false, disableNextButton: this.isLastQuestion(), selectedOption: this.result[currentQuestionIndex + 1].selectedOption });
    }

    updateResult = () => {
        //check if the question is already present in the result.
        const questionIndex = this.getCurrentQuestionIndex();

        if (questionIndex >= 0) {
            this.result[questionIndex].selectedOption = this.state.selectedOption
        } else {
            this.result.push({ id: this.state.currentQuestionId, selectedOption: this.state.selectedOption });
        }
    }
    previousQuestion = () => {
        const currentQuestionIndex = this.getCurrentQuestionIndex();
        const isFirstQuestion = (currentQuestionIndex - 1) === 0;
        const previousQuestion = this.questionsAndOptions.filter((question) => {
            if (question.id === this.result[currentQuestionIndex - 1].id) return question;
        })[0];
        this.setState({ currentQuestionId: previousQuestion.id, disableFinishButton: true, disableNextButton: false, disableBackButton: isFirstQuestion, selectedOption: this.result[currentQuestionIndex - 1].selectedOption });
    }

    isLastQuestion = () => {
        return (this.result.length - 1) === (this.getCurrentQuestionIndex() + 1);
    }

    getCurrentQuestionIndex = () => {
        return this.result.findIndex((obj => obj.id === this.state.currentQuestionId));
    }

    finishExam = () => {
        let totalMarks = 0;
        this.questionsAndOptions.forEach(info => {
            const answer = Enumerable.from(this.result).where(i => i.id === info.id).firstOrDefault();
            if (answer.selectedOption === info.correct_option) totalMarks = totalMarks + 1;
        });
        const info = this.questionsAndOptions[0];
        const data = {
            organizationId: info.organization_id,
            studentId: this.props.userId,
            departmentName: info.department,
            totalMarks: totalMarks,
            outOf: this.questionsAndOptions.length,
            examDate: new Date().toUTCString()
        };
        emitEvent("updateResult", data);
    }

    getDialogContent = () => {
        return <div className="alert-msg-container">
            <WarningIcon style={{ height: "60px", width: '60px' }} color="error" />
            {this.getAlertMessage()}
        </div>
    }

    getAlertMessage = () => {
        if (this.state.noQuestionsFound)
            return `Please contact your Administrator, No question has been added for '${this.departmentName}'`;
        return "You are about to finish the exam"
    }

    closeDialog = () => {
        this.setState({ askConfirmation: false, noQuestionsFound: false });
    }

    getDialogButtons = () => {
        if (this.state.askConfirmation) {
            return (
                <div className="edit-dialog-buttons">
                    <ActionButton text="Finish" flatButton={true} onClick={this.finishExam} />
                    <ActionButton text="Cancel" flatButton={true} onClick={this.closeDialog} />
                </div>
            )
        }
    }
    render() {
        if(this.state.redirectToThankyouPage){
            return(<Redirect to="/thankyou" />)
        }
        const primaryButtonTheme = {
            light: '#90CAF9',
            main: '#2196F3',
            dark: '#1E88E5',
            contrastText: '#fff',
        };
        const secondaryButtonTheme = {
            light: '#F8BBD0',
            main: '#E91E63',
            dark: '#AD1457',
            contrastText: '#fff',
        };
        const theme = createMuiTheme({
            palette: {
                primary: primaryButtonTheme,
                secondary: secondaryButtonTheme
            }
        });

        return (
            <MuiThemeProvider theme={theme}>
                <div className="exam-holder">
                    <div className="question-options-container">
                        {this.getRadioButtons()}
                        {this.getActionButtons()}
                    </div>
                    <Dialog isOpen={this.state.askConfirmation || this.state.noQuestionsFound} isAlertDialog={true} dialogContent={this.getDialogContent()} dialogButtons={this.getDialogButtons()} dialogTitle={this.state.noQuestionsFound ? "Attention" : "Finish Exam"} />
                </div>
            </MuiThemeProvider>
        )

    }

    componentDidMount() {
        const values = queryString.parse(window.location.search)
        this.departmentName = values.departmentName;
        fetch(`http://localhost:8080/getQuestionsOptionsForDepartments?departmentName=${this.departmentName}`).then((response) => response.json())
            .then((data) => {
                this.questionsAndOptions = this.remainingQuestions = data;
                if (data && data.length) {
                    this.result = data.map((question) => {
                        return { id: question.id, selectedOption: '' };
                    });
                    if (this.questionsAndOptions.length === 1)
                        this.setState({ currentQuestionId: data[0].id, disableNextButton: true, disableFinishButton: false })
                    else
                        this.setState({ currentQuestionId: data[0].id })
                } else {
                    this.setState({ noQuestionsFound: true });
                }
            });
    }
}

export default Exam;