import React, { Component } from 'react';
import './App.css';
import Routes from './Routes'
import { NotificationContainer, NotificationManager } from 'react-notifications';
import { subscribeToEvent } from './Api';


class App extends Component {
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

    return (
      <div className="App" style={{ display: 'flex', flexDirection: 'column' }}>        
        <Routes />
        <NotificationContainer />
      </div>
    );
  }
}



export default App;
