import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from "react-redux";
import { BrowserRouter as Router, Route } from "react-router-dom";

import './index.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';

import { store } from "./redux/store";
import RegisterServiceWorker from './register_service_worker';
import Block from './pages/Block';
import Header from './components/header/header';
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
        <Header />
        <Route exact={true} path="/" component={Home} />
        <Route path="/send_signed_parcel" component={SendSignedParcel} />
        <Route path="/node_info" component={NodeInfo} />
        <Route path="/block/:id" component={Block} />
        <Route path="/parcel/:hash" component={Parcel} />
        <Route path="/account/:address" component={Account} />
        <Route path="/asset/:type" component={Asset} />
      </div>
    </Router >
  </Provider >,
  document.getElementById('root') as HTMLElement
);
RegisterServiceWorker();
