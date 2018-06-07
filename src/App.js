import React, { Component } from 'react';
import './App.css';
import Routes from './Routes'

class App extends Component {
  loggedIn = () => {
    return false;
  }
  render() {
    return (
      <div className="App">
       <Routes/>
      </div>
    );
  }
}

export default App;
