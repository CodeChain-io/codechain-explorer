import { faAngleLeft, faAngleRight, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BlockDoc } from "codechain-indexer-types";
import * as _ from "lodash";
import * as React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router";
import { Link } from "react-router-dom";
import { Container } from "reactstrap";
import { RootState } from "src/redux/actions";
import { BlocksResponse } from "src/request/RequestBlocks";
import RequestServerTime from "src/request/RequestServerTime";
import { getUnixTimeLocaleString } from "src/utils/Time";
import { CommaNumberString } from "../../components/util/CommaNumberString/CommaNumberString";
import DataTable from "../../components/util/DataTable/DataTable";
import { RequestBlocks, RequestTotalBlockCount } from "../../request";
import "./Blocks.scss";

interface PaginationState {
    shouldMoveToNext: boolean;
    shouldMoveToPrevious: boolean;
    shouldMoveToFirst: boolean;
    hasNextPage?: boolean;
    hasPreviousPage?: boolean;
    firstEvaluatedKey?: string;
    lastEvaluatedKey?: string;
    itemsPerPage?: number;
}

interface State extends PaginationState {
    blocks: BlockDoc[];
    totalBlockCount?: number;
    isBlockRequested: boolean;
}

interface OwnProps {
    location: {
        search: string;
    };
}

interface StateProps {
    serverTimeOffset?: number;
}
type Props = OwnProps & StateProps;

class Blocks extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            blocks: [],
            totalBlockCount: undefined,
            isBlockRequested: false,
            itemsPerPage: undefined,
            shouldMoveToNext: false,
            shouldMoveToPrevious: false,
            shouldMoveToFirst: false
        };
    }

    public componentWillReceiveProps(props: Props) {
        if (props.location.search !== this.props.location.search) {
            this.setState({
                blocks: [],
                isBlockRequested: false,
                itemsPerPage: undefined,
                shouldMoveToNext: false,
                shouldMoveToPrevious: false,
                shouldMoveToFirst: false
            });
        }
    }

    public render() {
        const {
            location: { search },
            serverTimeOffset
        } = this.props;
        const params = new URLSearchParams(search);
        const lastEvaluatedKey = params.get("lastEvaluatedKey") || undefined;
        const firstEvaluatedKey = params.get("firstEvaluatedKey") || undefined;
        const itemsPerPage = params.get("itemsPerPage") ? parseInt(params.get("itemsPerPage") as string, 10) : 25;
        const { blocks, totalBlockCount, isBlockRequested } = this.state;

        if (this.state.shouldMoveToNext) {
            return (
                <Redirect
                    push={true}
                    to={`/blocks?lastEvaluatedKey=${this.state.lastEvaluatedKey}&itemsPerPage=${this.state
                        .itemsPerPage || itemsPerPage}`}
                />
            );
        }
        if (this.state.shouldMoveToPrevious) {
            return (
                <Redirect
                    push={true}
                    to={`/blocks?firstEvaluatedKey=${this.state.firstEvaluatedKey}&itemsPerPage=${this.state
                        .itemsPerPage || itemsPerPage}`}
                />
            );
        }
        if (this.state.shouldMoveToFirst) {
            return <Redirect push={true} to={`/blocks?itemsPerPage=${this.state.itemsPerPage || itemsPerPage}`} />;
        }
        if (totalBlockCount === undefined) {
            return <RequestTotalBlockCount onBlockTotalCount={this.onTotalBlockCount} onError={this.onError} />;
        }
        if (serverTimeOffset === undefined) {
            return <RequestServerTime />;
        }
        return (
            <Container className="blocks">
                {!isBlockRequested ? (
                    <div>
                        <RequestBlocks
                            onBlocks={this.onBlocks}
                            firstEvaluatedKey={firstEvaluatedKey}
                            lastEvaluatedKey={lastEvaluatedKey}
                            itemsPerPage={itemsPerPage}
                            showProgressBar={false}
                            onError={this.onError}
                        />
                        <RequestTotalBlockCount onBlockTotalCount={this.onTotalBlockCount} onError={this.onError} />
                    </div>
                ) : null}
                <div className="d-flex align-items-end">
                    <div>
                        <h1>Latest blocks</h1>
                        <div className="d-flex mt-small">
                            <div className="d-inline ml-auto pager">
                                <ul className="list-inline">
                                    <li className="list-inline-item">
                                        <button
                                            disabled={this.state.hasPreviousPage !== true || !isBlockRequested}
                                            className={`btn btn-primary page-btn ${
                                                this.state.hasPreviousPage !== true || !isBlockRequested
                                                    ? "disabled"
                                                    : ""
                                            }`}
                                            type="button"
                                            onClick={this.moveBefore}
                                        >
                                            <FontAwesomeIcon icon={faAngleLeft} /> Prev
                                        </button>
                                    </li>
                                    <li className="list-inline-item">
                                        <div className="number-view" />
                                    </li>
                                    <li className="list-inline-item">
                                        <button
                                            disabled={this.state.hasNextPage !== true || !isBlockRequested}
                                            className={`btn btn-primary page-btn ${
                                                this.state.hasNextPage !== true || !isBlockRequested ? "disabled" : ""
                                            }`}
                                            type="button"
                                            onClick={this.moveNext}
                                        >
                                            Next <FontAwesomeIcon icon={faAngleRight} />
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="ml-auto mb-3">
                        <span>Show </span>
                        <select onChange={this.handleOptionChange} defaultValue={itemsPerPage.toString()}>
                            <option value="25">25</option>
                            <option value="50">50</option>
                            <option value="75">75</option>
                            <option value="100">100</option>
                        </select>
                        <span> entries</span>
                    </div>
                </div>
                <div className="block-table">
                    <div>
                        <div>
                            <DataTable>
                                <thead>
                                    <tr>
                                        <th style={{ width: "15%" }}>No.</th>
                                        <th style={{ width: "10%" }} className="text-right">
                                            Tx
                                        </th>
                                        <th style={{ width: "40%" }}>Author</th>
                                        <th style={{ width: "15%" }} className="text-right">
                                            Reward
                                        </th>
                                        <th style={{ width: "20%" }} className="text-right">
                                            Time
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {blocks.length === 0 ? (
                                        <tr>
                                            <td colSpan={12}>
                                                <div className="text-center mt-12">
                                                    <FontAwesomeIcon
                                                        className="spin"
                                                        icon={faSpinner}
                                                        spin={true}
                                                        size={"2x"}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        _.map(blocks, block => {
                                            return (
                                                <tr key={`block-${block.hash}`}>
                                                    <td scope="row">
                                                        <Link to={`/block/${block.number}`}>
                                                            {block.number.toLocaleString()}
                                                        </Link>
                                                    </td>
                                                    <td className="text-right">
                                                        {block.transactionsCount.toLocaleString()}
                                                    </td>
                                                    <td>
                                                        <Link to={`/addr-platform/${block.author}`}>
                                                            {block.author}
                                                        </Link>
                                                    </td>
                                                    <td className="text-right">
                                                        <CommaNumberString text={block.miningReward} />
                                                        <span className="ccc">CCC</span>
                                                    </td>
                                                    <td className="text-right">
                                                        {block.timestamp
                                                            ? getUnixTimeLocaleString(block.timestamp, serverTimeOffset)
                                                            : "Genesis"}
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </DataTable>
                        </div>
                    </div>
                </div>
            </Container>
        );
    }

    private moveNext = (e: any) => {
        e.preventDefault();
        this.setState({ shouldMoveToNext: true });
    };

    private moveBefore = (e: any) => {
        e.preventDefault();
        this.setState({ shouldMoveToPrevious: true });
    };

    private handleOptionChange = (event: any) => {
        const selected = parseInt(event.target.value, 10);
        this.setState({
            itemsPerPage: selected,
            shouldMoveToFirst: true
        });
    };

    private onTotalBlockCount = (totalBlockCount: number) => {
        this.setState({ totalBlockCount });
    };

    private onBlocks = (response: BlocksResponse) => {
        const { data, hasNextPage, hasPreviousPage, lastEvaluatedKey, firstEvaluatedKey } = response;
        this.setState({
            blocks: data,
            isBlockRequested: true,
            hasNextPage,
            hasPreviousPage,
            lastEvaluatedKey,
            firstEvaluatedKey
        });
    };

    private onError = (error: any) => {
        console.log(error);
    };
}

export default connect((state: RootState) => {
    return {
        serverTimeOffset: state.appReducer.serverTimeOffset
    };
})(Blocks);
