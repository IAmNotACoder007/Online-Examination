import React, { Component } from 'react';
import './App.css';
import Routes from './Routes'
import { NotificationContainer, NotificationManager } from 'react-notifications';
import { subscribeToEvent } from './Api';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { withStyles } from '@material-ui/core/styles';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';

class App extends Component {
  state = {
    loggedIn: false
  }
  isAdmin = false;

  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  getTopBarRightSideContent = () => {
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);
    if (!this.state.loggedIn) {
      return (<Button color="inherit">Register Organization</Button>)
    }
    else {
      if (this.isAdmin) {
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
              <MenuItem onClick={this.handleClose}>Profile</MenuItem>
              <MenuItem onClick={this.handleClose}>My account</MenuItem>
            </Menu>
          </div>
        )
      }

    }
  }

  render() {
    subscribeToEvent("operationFailed", (data) => {
      let message = undefined;
      if (data)
        message = JSON.parse(data).message;
      NotificationManager.error((message || 'Something went wrong.'), 'Error');
    });

    subscribeToEvent("operationSuccessful", (data) => {
      let message = undefined;
      if (data)
        message = JSON.parse(data).message;
      NotificationManager.success((message || 'Successfully done.'), 'Success');
    });

    subscribeToEvent("loginSuccessful", (data) => {
      const userInfo = JSON.parse(data)[0];
      this.isAdmin = userInfo.is_admin;
      this.setState({ loggedIn: true });
    });




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
      <div className="App" style={{ display: 'flex', flexDirection: 'column' }}>
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
          <Routes />
          <NotificationContainer />
        </MuiThemeProvider>
      </div>
    );
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

export default withStyles(styles)(App);
