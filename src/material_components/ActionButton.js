import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';

class ActionButton extends Component {
    getButtonType = () => {
        return this.props.flatButton ? 'flat' : "raised"
    }

    render() {        
        return (          
                <Button disabled={this.props.disabled} style={this.props.styles} variant={this.getButtonType()} id={this.props.id} size={this.props.size} color={this.props.color} onClick={this.props.onClick} className={this.props.class}>
                    {this.props.text}
                </Button>           
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
    styles: PropTypes.object

}

ActionButton.defaultProps = {
    color: 'primary',
    class: '',
    size: "medium",
    id: '',
    disabled: false,
    flatButton: false,   
    styles: {}
}

export default ActionButton;