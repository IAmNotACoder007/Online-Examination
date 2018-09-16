import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';

class PaperSheet extends Component {
    constructor(props) {
        super(props);
        this.props = props;
    }
    render() {
        const { classes } = this.props.classes;
        return (
            <div className="paper-sheet">
                <Paper className={classes} elevation={this.props.elevation}>
                    {this.props.content}
                </Paper>
            </div>
        );
    }
}

PaperSheet.defaultProps = {
    classes: '',
    elevation: 2
}

PaperSheet.propTypes = {
    classes: PropTypes.string,
    content: PropTypes.any.isRequired,
    elevation: PropTypes.number
};

export default PaperSheet;