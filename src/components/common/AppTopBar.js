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
import '../../styles/AppTopbar.css'

class TopBar extends Component {
    constructor(props) {
        super(props);
    }
    state = {
        showOrganizationRegistrationDlg: false,
        organizationAlreadyRegistered: false,
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

    getTopBarRightSideContent = () => {
        const { anchorEl } = this.state;
        const open = Boolean(anchorEl);
        if (this.props.isAdmin === undefined) {
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
                            <MenuItem onClick={this.handleClose}>Chnage password</MenuItem>                            
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
        const theme = createMuiTheme({
            palette: {
                primary: {
                    light: '#90CAF9',
                    main: '#2196F3',
                    dark: '#1E88E5',
                    contrastText: '#fff',
                },
                secondary: {
                    light: '#F8BBD0',
                    main: '#E91E63',
                    dark: '#AD1457',
                    contrastText: '#fff',
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