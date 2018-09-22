import React, { Component } from 'react';
import PropTypes from 'prop-types';
import color from '@material-ui/core/colors/amber';

class ColorPicker extends Component {
    defaultStates = {
        selectedColor: ""
    }
    state = { ...this.defaultStates }

    themeColors = [
        {
            light: '#90CAF9',
            main: '#2196F3',
            dark: '#1E88E5',
            contrastText: '#fff',
        },
        {
            light: '#80CBC4',
            main: '#009688',
            dark: '#00897B',
            contrastText: '#fff',
        },
    ]

    colorButtonStyls = {
        border: 'none',
        borderRadius: '5px',
        margin: '5px',
        cursor: 'pointer',
        height: '25px',
        width: '25px'
    }

    getAvailableColors() {
        return this.themeColors.map((color) => {
            return (
                <button key={color.main} className="html-button" onClick={() => { this.changeThemeColor(color.main) }} style={{ backgroundColor: color.main, ...this.colorButtonStyls }}></button>
            )
        })
    }

    changeThemeColor(color) {
        this.setState({ selectedColor: color })
    }

    render() {
        const holderStyles = {
            display: 'flex',
            height: '150px',
            width: '150px',
            flexDirection: 'column',
            background: 'rgb(255, 255, 255)',
            border: '0px solid rgba(0, 0, 0, 0.25)',
            boxShadow: 'rgba(0, 0, 0, 0.25) 0px 1px 4px',
            borderRadius: '4px'
        }

        const selectedColorStyles = {
            flex: 1,
            backgroundColor: this.state.selectedColor || this.props.defaultSelected,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 500
        }

        const availableColorsStyles = {
            height: '50%'
        }
        return (
            <div className="color-picker" style={holderStyles}>
                <div className="selected-color" style={selectedColorStyles}>
                    {this.state.selectedColor || this.props.defaultSelected}
                </div>
                <div className="available-colors" style={availableColorsStyles}>
                    {this.getAvailableColors()}
                </div>
            </div>
        )
    }
}

ColorPicker.propTypes = {
    onChange: PropTypes.func.isRequired,
    defaultSelected: PropTypes.string,
}

ColorPicker.defaultProps = {
    defaultSelected: "#2196F3"
}

export default ColorPicker;