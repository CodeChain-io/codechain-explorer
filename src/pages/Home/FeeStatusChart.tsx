import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as _ from "lodash";
import * as React from "react";

const { BarSeries, Histogram, PatternLines, withParentSize, XAxis, YAxis } = require("@data-ui/histogram");

import RequestFeeStats, { FeeStatus } from "src/request/RequestFeeStats";

const ResponsiveHistogram = withParentSize(
    ({ parentWidth, parentHeight, ...rest }: { parentWidth: any; parentHeight: any }) => (
        <Histogram ariaLabel="Fee stats" width={parentWidth} height={parentHeight} {...rest} />
    )
);

enum TransactionLogType {
    PAY = "Pay",
    TRANSFER_ASSET = "TransferAsset"
}

interface OwnProps {
    onError: (err: any) => void;
}

interface State {
    data?: FeeStatus;
    transactionLogType: TransactionLogType;
    rawData?: string[];
}

type Props = OwnProps;
class FeeStatusChart extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { transactionLogType: TransactionLogType.PAY };
    }

    public render() {
        const { data, transactionLogType, rawData } = this.state;
        if (data == null || rawData == null) {
            return (
                <div className="chart-container">
                    <div className="chart">
                        <div className="header-part">
                            <h2 className="title">Fee stats</h2>
                        </div>
                        <div className="text-center mt-3">
                            <FontAwesomeIcon
                                className="spin"
                                icon={faSpinner}
                                spin={true}
                                size={"2x"}
                                style={{ marginTop: "80px" }}
                            />
                        </div>
                        <RequestFeeStats onData={this.onData} onError={this.props.onError} />
                    </div>
                </div>
            );
        }
        return (
            <div className="chart-container">
                <div className="chart">
                    <div className="header-part">
                        <h2 className="title">Fee stats</h2>
                        <div className="subtitle">Last 200 {transactionLogType} transactions</div>
                        <select className="select" defaultValue={transactionLogType} onChange={this.onTxLogTypeChanged}>
                            <option value={TransactionLogType.PAY}>Pay</option>
                            <option value={TransactionLogType.TRANSFER_ASSET}>TransferAsset</option>
                        </select>
                    </div>
                    <div className="chart-item">
                        {rawData.length !== 0 ? (
                            <ResponsiveHistogram
                                // tslint:disable-next-line:jsx-no-lambda
                                renderTooltip={({ _E, datum, _D, _C }: { _E: any; datum: any; _D: any; _C: any }) => (
                                    <div style={{ fontSize: 12 }}>
                                        {datum.bin0}
                                        CCC ~ {datum.bin1}
                                        CCC: <strong>{datum.count}</strong>
                                    </div>
                                )}
                            >
                                <PatternLines
                                    id="normal"
                                    height={8}
                                    width={8}
                                    stroke="#fff"
                                    background="hsl(191, 95%, 42%)"
                                    strokeWidth={1}
                                    orientation={["horizontal", "vertical"]}
                                />
                                <BarSeries stroke="hsl(191, 95%, 42%)" fill="hsl(191, 95%, 42%)" rawData={rawData} />
                                <XAxis
                                    tickValues={this.bottomTickValues(rawData.sort())}
                                    // tslint:disable-next-line:jsx-no-lambda
                                    tickFormat={(x: any) => {
                                        return String(Math.floor(x) + " CCC");
                                    }}
                                />
                                <YAxis label={" "} />
                            </ResponsiveHistogram>
                        ) : (
                            ""
                        )}
                    </div>
                </div>
            </div>
        );
    }

    private onData = (data: FeeStatus) => {
        let rawData: string[];
        switch (this.state.transactionLogType) {
            case TransactionLogType.PAY:
                rawData = data.pay!;
                break;
            case TransactionLogType.TRANSFER_ASSET:
                rawData = data.transferAsset!;
                break;
            default:
                rawData = [];
        }
        this.setState({ data, rawData });
    };

    private onTxLogTypeChanged = (event: any) => {
        let txType = TransactionLogType.PAY;
        let rawData: string[];
        switch (event.target.value) {
            case TransactionLogType.PAY:
                txType = TransactionLogType.PAY;
                rawData = this.state.data!.pay!;
                break;
            case TransactionLogType.TRANSFER_ASSET:
                txType = TransactionLogType.TRANSFER_ASSET;
                rawData = this.state.data!.transferAsset!;
                break;
            default:
                rawData = [];
        }
        this.setState({
            transactionLogType: txType,
            rawData
        });
    };

    private bottomTickValues = (data: string[]) => {
        if (data.length >= 2) {
            return [_.first(data), _.first(data) === _.last(data) ? parseInt(_.last(data)!, 10) + 1 : _.last(data)];
        } else {
            return undefined;
        }
    };
}

export default FeeStatusChart;
