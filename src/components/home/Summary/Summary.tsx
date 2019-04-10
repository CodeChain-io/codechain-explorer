import * as _ from "lodash";
import * as React from "react";
import { Col, Row } from "reactstrap";

import { connect } from "react-redux";
import { RootState } from "../../../redux/actions";
import { WeeklyLogType } from "../../../request/RequestWeeklyLogs";
import "./Summary.scss";
import WeeklyChart from "./WeeklyChart";

interface State {
    latestBestBlockNumber?: number;
}

interface StateProps {
    bestBlockNumber?: number;
}

type Props = StateProps;

class Summary extends React.Component<Props, State> {
    private refresher: any;
    constructor(props: {}) {
        super(props);
        this.state = {
            latestBestBlockNumber: undefined
        };
    }
    public componentWillUnmount() {
        if (this.refresher) {
            clearInterval(this.refresher);
        }
    }
    public componentDidMount() {
        this.refresher = setInterval(this.refreshSummary, 5000);
    }
    public render() {
        const { bestBlockNumber } = this.props;
        return (
            <div className="summary">
                <Row>
                    <Col lg="6">
                        <WeeklyChart
                            bestBlockNumber={bestBlockNumber}
                            type={WeeklyLogType.BLOCK_COUNT}
                            chartType={"bar"}
                            title={`Weekly block log`}
                            onError={this.onError}
                        />
                    </Col>
                    <Col lg="6" className="mt-3 mt-lg-0">
                        <WeeklyChart
                            bestBlockNumber={bestBlockNumber}
                            type={WeeklyLogType.TX_COUNT}
                            chartType={"line"}
                            title={`Weekly transaction log`}
                            onError={this.onError}
                        />
                    </Col>
                </Row>
            </div>
        );
    }

    private refreshSummary = () => {
        const { bestBlockNumber } = this.props;
        this.setState({ latestBestBlockNumber: bestBlockNumber });
    };

    private onError = (error: any) => {
        console.log(error);
    };
}

export default connect((state: RootState) => {
    return {
        bestBlockNumber: state.appReducer.bestBlockNumber
    };
})(Summary);
