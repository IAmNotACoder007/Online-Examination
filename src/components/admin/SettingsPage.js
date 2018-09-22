import React, { Component } from 'react';
import ColorPicker from './settings components/ColorPickerPage';
import ActionButton from '../../material_components/ActionButton';
class Settings extends Component {

    onThemeColorChange() {

    }

    saveSettings() {

    }

    render() {
        const holderStyles = {
            height: 'calc(100% - 50px)',
            maxWidth: '100%',
            display: 'flex',
            marginTop: '25px',
            justifyContent: 'center',
            flexDirection: 'column',
            alignItems: 'center',
        }

        const componentsHolderStyles = {
            height: '90%',
            boxShadow: 'rgba(0, 0, 0, 0.2) 0px 1px 4px',
            width: '50%',
            maxWidth: '450px',
            padding: '5px',
            margin: '5px'
        }

        const componentsStyles = {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
        }

        const footerStyles = {
            width: '50%',

        }

        return (
            <div style={holderStyles} className="settings-holder">
                <content style={componentsHolderStyles} className="settings-components-holder">
                    <div style={componentsStyles} className="settings-component">
                        <p>Theme Color</p>
                        <ColorPicker onChange={this.onThemeColorChange}></ColorPicker>
                    </div>
                </content>
                <footer style={footerStyles}>
                    <ActionButton text="Save" onClick={this.saveSettings}></ActionButton>
                </footer>
            </div>
        )
    }
}

export default Settings;