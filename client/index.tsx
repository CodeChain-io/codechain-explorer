import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from "react-redux";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { IndexLinkContainer } from 'react-router-bootstrap';

import './index.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';

import { store } from "./redux/store";
import RegisterServiceWorker from './register_service_worker';
import Block from './pages/Block';
import HealthChecker from './components/util/HealthChecker';
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
        <Navbar>
          <Navbar.Header>
            <IndexLinkContainer to="/">
              <Navbar.Brand>
                CodeChain Explorer
              </Navbar.Brand>
            </IndexLinkContainer>
          </Navbar.Header>
          <Nav>
            <IndexLinkContainer to="/">
              <NavItem eventKey={1}>
                Home
              </NavItem>
            </IndexLinkContainer>
            <IndexLinkContainer to="/send_signed_parcel">
              <NavItem eventKey={2}>
                Send Parcel
              </NavItem>
            </IndexLinkContainer>
            <IndexLinkContainer to="/node_info">
              <NavItem eventKey={3}>
                Node Info
              </NavItem>
            </IndexLinkContainer>
          </Nav>
          <Nav pullRight={true}>
            <NavItem>
              <HealthChecker />
            </NavItem>
          </Nav>
        </Navbar>
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
