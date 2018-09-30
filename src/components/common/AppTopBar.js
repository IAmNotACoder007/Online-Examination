import React, { Component } from 'react'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { withStyles } from '@material-ui/core/styles';
import RegistrationPage from '../../components/RegisterPage';
import { Link } from 'react-router-dom';
import '../../styles/AppTopbar.css';
import Dialog from '../../material_components/Dialog';
import ThemePicker from '../admin/settings components/ColorPickerPage';
import ActionButton from '../../material_components/ActionButton';
import { emitEvent } from '../../Api';
import Themes from '../admin/Themes';

class TopBar extends Component {
    constructor(props) {
        super(props);
    }
    state = {
        showOrganizationRegistrationDlg: false,
        organizationAlreadyRegistered: false,
        openThemePicker: false,
        themeColor: '',
        userTheme: '#2196F3'
    }


    handleMenu = event => {
        this.setState({ anchorEl: event.currentTarget });
    };


    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    handleOrgRegistrationClose = () => {
        this.setState({ showOrganizationRegistrationDlg: false })
    }

    onThemeChange = (color) => {
        this.setState({ themeColor: color });
    }

    getThemePicker = (currentTheme) => {
        return (<ThemePicker defaultSelected={currentTheme} onChange={this.onThemeChange}></ThemePicker>)
    }

    saveTheme = () => {
        emitEvent("saveTheme", { theme: this.state.themeColor, userId: (this.props.userId || this.props.organizationId) });
        this.closeThemePickerDialog();
    }

    closeThemePickerDialog = () => {
        this.setState({ openThemePicker: false })
    }

    getThemePickerDialogButton = () => {
        return (<div>
            <ActionButton text="Save" onClick={this.saveTheme} flatButton={true} />
            <ActionButton text="Cancel" onClick={this.closeThemePickerDialog} flatButton={true} />
        </div>)
    }

    showThemePicker = () => {
        this.setState({ openThemePicker: true }, () => {
            this.handleClose();
        })
    }

    getTopBarRightSideContent = () => {
        const { anchorEl } = this.state;
        const open = Boolean(anchorEl);
        if (!this.props.isAdmin && !this.props.isStudentLogin) {
            return (<Button color="inherit" onClick={() => { this.setState({ showOrganizationRegistrationDlg: true }) }}>Register Organization</Button>)
        }
        else {
            if (this.props.isAdmin) {
                return (
                    <div>
                        <IconButton
                            aria-owns={open ? 'menu-appbar' : null}
                            aria-haspopup="true"
                            onClick={this.handleMenu}
                            color="inherit"
                        >
                            <AccountCircle />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={open}
                            onClose={this.handleClose}
                        >
                            <MenuItem onClick={this.handleClose}>Change password</MenuItem>
                            <MenuItem onClick={this.showThemePicker}>Change Theme</MenuItem>
                            <div className="top-bar-link"><Link to="/logout">Logout</Link></div>
                        </Menu>
                    </div>
                )
            }

        }
    }

    registerOrganization = (data) => {
        if (!data || Object.keys(data).length === 0) return;
        fetch('http://127.0.0.1:8080/registerOrganization/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: data.fullName,
                email: data.emailAddress,
                phone: data.mobileNumber,
                password: data.password
            })
        }).then((response) => {
            return response.json();
        }).then((data) => {
            if (data.isAlreadyExists) {
                this.setState({ organizationAlreadyRegistered: true });
            } else {
                this.handleOrgRegistrationClose();
            }
        });
    }

    render() {
        const userThemeColors = this.props.theme || Themes.defaultTheme;
        const theme = createMuiTheme({
            palette: {
                primary: {
                    ...userThemeColors
                }

            }
        });
        return (
            <div className="top-bar-container">
                <MuiThemeProvider theme={theme}>
                    <div>
                        <AppBar position="static">
                            <Toolbar variant="dense" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography style={{ flex: '1', textAlign: 'left' }} variant="title" color="inherit">
                                    Online Exam
                                </Typography>
                                {this.getTopBarRightSideContent()}
                            </Toolbar>
                        </AppBar>
                    </div>
                    <RegistrationPage isalreadyRegister={this.state.organizationAlreadyRegistered} register={this.registerOrganization} open={this.state.showOrganizationRegistrationDlg} handleClose={this.handleOrgRegistrationClose} title="Register Organization" />
                    <Dialog styleClass="theme-picker-dialog" dialogTitle="Pick Theme" isOpen={this.state.openThemePicker} dialogContent={this.getThemePicker(userThemeColors.main)} dialogButtons={this.getThemePickerDialogButton()}></Dialog>
                </MuiThemeProvider>
            </div>
        )
    }
}

const styles = {
    root: {
        flexGrow: 1,
    },
    flex: {
        flexGrow: 1,
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
};

export default withStyles(styles)(TopBar);