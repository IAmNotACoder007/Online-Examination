import React, { Component } from 'react';
import './App.css';
import Routes from './Routes'
import { NotificationContainer } from 'react-notifications';

class App extends Component {
  loggedIn = () => {
    return false;
  }
  render() {
    return (
      <div className="App">
       <Routes/>
       <NotificationContainer/>
      </div>
    );
  }
}

export default App;
