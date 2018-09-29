import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';
import FormHelperText from '@material-ui/core/FormHelperText';
import '../styles/TextBox.css';
import InputAdornment from '@material-ui/core/InputAdornment';


class TextBox extends Component {
    handleChange = fieldName => event => {
        const val = event.target.value;
        if (this.props.onChange)
            this.props.onChange(fieldName, val)
    };

    getErrorJsx = () => {
        if (this.props.error)
            return <FormHelperText id="name-error-text">{this.props.errorMessage}</FormHelperText>
    }

    isDisabled = () => {
        if (this.props.disabled) return "disabled"
    }
    render() {       
        return (
            <div className="textbox">
                <TextField required={this.props.required}
                    error={this.props.error}
                    multiline={this.props.multiline}
                    id={this.props.id}
                    label={this.props.label}
                    placeholder={this.props.placeholder}
                    className={this.props.className}
                    margin="normal"
                    defaultValue={this.props.defaultValue}
                    onChange={this.handleChange(this.props.fieldName)}
                    fullWidth={this.props.fullWidth}
                    type={this.props.type}
                    rows={this.props.rows}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                {this.props.inputAdornment}
                            </InputAdornment>
                        ),
                    }}
                    disabled={this.props.disabled}
                />
                {this.getErrorJsx()}

            </div>
        )
    }
}

TextBox.propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    className: PropTypes.string,
    defaultValue: PropTypes.string,
    type: PropTypes.string,
    onChange: PropTypes.func,
    fullWidth: PropTypes.bool,
    required: PropTypes.bool,
    error: PropTypes.bool,
    errorMessage: PropTypes.string,
    inputAdornment: PropTypes.any,
    fieldName: PropTypes.string.isRequired,
    multiline: PropTypes.bool,
    rows: PropTypes.string,
    disabled: PropTypes.bool
}

TextBox.defaultProps = {
    label: '',
    placeholder: '',
    className: '',
    defaultValue: '',
    type: 'text',
    fullWidth: false,
    required: false,
    error: false,
    errorMessage: '',
    inputAdornment: '',
    onChange: undefined,
    multiline: false,
    rows: "5",
    disabled: false,
}

export default TextBox;