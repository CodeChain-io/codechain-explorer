import * as React from 'react';
import './App.css';

import ServerStatus from "./ServerStatus";

class App extends React.Component {
  public render() {
    return (
      <div className="App">
        <ServerStatus />
      </div>
    );
  }
}

export default App;
