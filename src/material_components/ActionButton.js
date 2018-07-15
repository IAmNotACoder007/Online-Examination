import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

class ActionButton extends Component {
    getButtonType = () => {
        return this.props.flatButton ? '' : "raised"
    }

    render() {
        const primaryButtonTheme=this.props.primaryButtonTheme;
        const secondaryButtonTheme=this.props.secondaryButtonTheme;
        const theme = createMuiTheme({
            palette: {
                primary:primaryButtonTheme,                               
                secondary:secondaryButtonTheme                
            }
        });
        return (
            <MuiThemeProvider theme={theme}>
                <Button disabled={this.props.disabled} variant={this.getButtonType()} id={this.props.id} size={this.props.size} color={this.props.color} onClick={this.props.onClick} className={this.props.button}>
                    {this.props.text}
                </Button>
            </MuiThemeProvider>
        )
    }
}


ActionButton.propTypes = {
    color: PropTypes.string,
    text: PropTypes.string.isRequired,
    class: PropTypes.string,
    onClick: PropTypes.func.isRequired,
    size: PropTypes.string,
    id: PropTypes.string,
    disabled: PropTypes.bool,
    flatButton: PropTypes.bool,
    primaryButtonTheme: PropTypes.object,
    secondaryButtonTheme: PropTypes.object,

}

ActionButton.defaultProps = {
    color: 'primary',
    class: '',
    size: "medium",
    id: '',
    disabled: false,
    flatButton: false,
    primaryButtonTheme: {
        light: '#90CAF9',
        main: '#2196F3',
        dark: '#1E88E5',
        contrastText: '#fff',
    },
    secondaryButtonTheme: {
        light: '#F8BBD0',
        main: '#E91E63',
        dark: '#AD1457',
        contrastText: '#fff',
    }
}

export default ActionButton;