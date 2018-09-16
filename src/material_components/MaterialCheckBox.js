import React, { Component } from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import PropTypes from 'prop-types';

class MaterialCheckBox extends Component {
    state = {
        [this.props.value]: [this.props.checked]
    }
    handleChange = name => event => {
        this.props.onChange(name, event.target.checked)
    };
    render() {
        return (
            <FormControlLabel className="check-box"
                control={
                    <Checkbox disabled={this.props.disabled}
                        checked={this.props.checked}
                        onChange={this.handleChange(this.props.value)}
                        value={this.props.value}
                        color={this.props.color}
                    />
                }
                label={this.props.label}
            />
        )
    }
}

MaterialCheckBox.propTypes = {
    checked: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string,
    label: PropTypes.string,
    color: PropTypes.string,
    disabled: PropTypes.bool
}

MaterialCheckBox.defaultProps = {
    checked: false,
    value: "checkBox",
    label: "Check Box",
    color: "primary",
    disabled: false
}

export default MaterialCheckBox;