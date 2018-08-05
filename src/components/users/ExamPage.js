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

class Exam extends Component {
    departmentName = undefined;
    questionsAndOptions = [];
    remainingQuestions = [];

    state = {
        questionsAndOptions: [],
        currentQuestionId: ''
    }

    handleChange = event => {
        this.setState({ value: event.target.value });
    };

    getRadioButtons = () => {
        const currentQuestion = this.remainingQuestions.filter((question) => {
            if (question.id === this.state.currentQuestionId) return question
        })[0];
        if (currentQuestion) {
            return (
                <FormControl component="fieldset">
                    <FormLabel component="legend">{currentQuestion.questions}</FormLabel>
                    <RadioGroup
                        aria-label={currentQuestion.questions}
                        name={currentQuestion.questions}

                        value={this.state.value}
                        onChange={this.handleChange}
                    >
                        {currentQuestion.options.split(',').map((option) => {
                            return (
                                <FormControlLabel value={option} control={<Radio color="primary" />} label={option} />
                            )
                        })}
                    </RadioGroup>
                </FormControl>
            )
        }
    }

    nextQuestion = () => {
        this.remainingQuestions = this.remainingQuestions.filter((question) => {
            if (question.id !== this.state.currentQuestionId) return question
        });
        this.setState({ currentQuestionId: this.remainingQuestions[0].id })
    }

    render() {
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
                    {this.getRadioButtons()}
                    <ActionButton text="Next" onClick={this.nextQuestion} />
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
                this.setState({ currentQuestionId: data[0].id })
            });
    }
}

export default Exam;