import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from "react-redux";
import { BrowserRouter as Router, Link, Route } from "react-router-dom";

import './index.css';

import { store } from "./redux/store";
import RegisterServiceWorker from './register_service_worker';
import Block from './pages/Block';
import HealthChecker from './components/HealthChecker';
import Home from './pages/Home';
import Parcel from './pages/Parcel';
import Account from './pages/Account';
import Asset from "./pages/Asset";
import NodeInfo from "./pages/NodeInfo";
import SendSignedParcel from './pages/SendSignedParcel';

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <div>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/send_signed_parcel">Send Parcel</Link></li>
          <li><Link to="/node_info">Node Info</Link></li>
        </ul>
        <HealthChecker />
        <hr />
        <Route exact={true} path="/" component={Home} />
        <Route path="/send_signed_parcel" component={SendSignedParcel} />
        <Route path="/node_info" component={NodeInfo} />
        <Route path="/block/:id" component={Block} />
        <Route path="/parcel/:hash" component={Parcel} />
        <Route path="/account/:address" component={Account} />
        <Route path="/asset/:type" component={Asset} />
      </div>
    </Router>
  </Provider>,
  document.getElementById('root') as HTMLElement
);
RegisterServiceWorker();
