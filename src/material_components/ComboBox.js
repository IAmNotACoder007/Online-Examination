import React, { Component } from 'react'
import PropTypes from 'prop-types';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';


class ComboBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: ''
        }
        this.getMenuItem = () => {
            return (this.props.items.map((item, index) => {
                return (<MenuItem value={index + 1}>{item}</MenuItem>);
            }));
        }

        this.getSelected = () => {
            if (this.props.defaultSelected) {
                return (this.props.items.indexOf(this.props.defaultSelected) + 1)
            }
            return 1;
        }

        this.handleChange = event => {
            this.setState({ value: event.target.value })
            this.props.onChange(event.target.value);
        };
    }
    render() {
        return (
            <div className="exam-combo-box">
                <Select className="combo-box"
                    onChange={this.handleChange}
                    value={this.state.value || this.getSelected()}
                >
                    {this.getMenuItem()}
                </Select>
            </div>
        )
    }

}

export default ComboBox;

ComboBox.propTypes = {
    onChange: PropTypes.func.isRequired,
    items: PropTypes.array.isRequired,
    defaultSelected: PropTypes.string,
}

ComboBox.defaultProps = {
    defaultSelected: "",
    items: []
}