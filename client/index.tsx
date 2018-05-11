import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from "react-redux";
import { BrowserRouter as Router, Link, Route } from "react-router-dom";

import './index.css';

import { store } from "./redux/store";
import registerServiceWorker from './registerServiceWorker';
import Block from './pages/Block';
import ServerStatus from './ServerStatus';
import { RequestPing } from './components/requests';
import Home from './pages/Home';
import Transaction from './pages/Transaction';
import Account from './pages/Account';

// FIXME:
const Status = () => <div>Status</div>;

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <div>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/status">Status</Link></li>
        </ul>
        <ServerStatus />
        <RequestPing />
        <hr/>
        <Route exact={true} path="/" component={Home} />
        <Route path="/status" component={Status} />
        <Route path="/block/:id" component={Block} />
        <Route path="/tx/:hash" component={Transaction} />
        <Route path="/account/:address" component={Account} />
      </div>
    </Router>
  </Provider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
