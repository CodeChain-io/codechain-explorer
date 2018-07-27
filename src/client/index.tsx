import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./index.scss";

import { store } from "./redux/store";
import RegisterServiceWorker from "./register_service_worker";
import Block from "./pages/Block/Block";
import Header from "./components/header/Header/Header";
import Home from "./pages/Home/Home";
import Parcel from "./pages/Parcel/Parcel";
import Asset from "./pages/Asset/Asset";
import NodeInfo from "./pages/NodeInfo";
import SendSignedParcel from "./pages/SendSignedParcel";
import Transaction from "./pages/Transaction/Transaction";
import Footer from "./components/footer/Footer";
import PlatformAddress from "./pages/PlatformAddress/PlatformAddress";
import AssetTransferAddress from "./pages/AssetTransferAddress/AssetTransferAddress";
import PendingParcels from "./pages/PendingParcels/PendingParcels";
import Parcels from "./pages/Parcels/Parcels";
import Transactions from "./pages/Transactions/Transactions";
import Blocks from "./pages/Blocks/Blocks";
import NotFound from "./pages/NotFound/NotFound";

ReactDOM.render(
  <Provider store={store}>
    <Router>
        <div id="page">
        <Header />
        <div id="content">
            <Switch>
                <Route exact={true} path="/" component={Home} />
                <Route path="/send_signed_parcel" component={SendSignedParcel} />
                <Route path="/node_info" component={NodeInfo} />
                <Route path="/block/:id" component={Block} />
                <Route path="/parcel/:hash" component={Parcel} />
                <Route path="/asset/:type" component={Asset} />
                <Route path="/tx/:hash" component={Transaction} />
                <Route path="/addr-platform/:address" component={PlatformAddress} />
                <Route path="/addr-asset/:address" component={AssetTransferAddress} />
                <Route path="/parcels-pending" component={PendingParcels} />
                <Route path="/parcels" component={Parcels} />
                <Route path="/txs" component={Transactions} />
                <Route path="/blocks" component={Blocks} />
                <Route component={NotFound} />
            </Switch>
        </div>
        <Footer />
        </div>
    </Router >
  </Provider >,
  document.getElementById("root") as HTMLElement
);
RegisterServiceWorker();
