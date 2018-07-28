import React, { Component } from 'react';
import ComboBox from '../../material_components/ComboBox';
import PropTypes from 'prop-types';

class Departments extends Component {
    state = {
        departments: []
    }
    onChange = (val) => {
        this.props.onChange(this.state.departments[val-1])
    }
    render() {
        return (
            <div className="departments-containers">
                <ComboBox onChange={this.onChange} items={this.state.departments} defaultSelected={this.state.departments[0]} />
            </div>
        )
    }

    componentDidMount() {
        fetch("http://localhost:8080/getDepartments")
            .then(res => res.json())
            .then((departments) => {
                this.setState({ departments: departments.map((department) => { return department.department_name }) });
                this.props.onChange(this.state.departments[0]);
            });
    }
}

export default Departments;

Departments.propTypes = {
    onChange: PropTypes.func.isRequired
}