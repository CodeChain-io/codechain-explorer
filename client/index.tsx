import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from "react-redux";
import { BrowserRouter as Router, Link, Route } from "react-router-dom";

import App from './App';
import './index.css';

import { store } from "./redux/store";
import registerServiceWorker from './registerServiceWorker';

const Status = () => <div>Status</div>;

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <div>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/status">Status</Link></li>
        </ul>
        <Route exact={true} path="/" component={App} />
        <Route path="/status" component={Status} />
      </div>
    </Router>
  </Provider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
