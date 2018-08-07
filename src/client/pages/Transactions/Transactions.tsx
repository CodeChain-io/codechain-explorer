import * as React from "react";
import * as _ from "lodash";
import * as moment from "moment";
import { Container, Table } from "reactstrap";
import { Redirect } from "react-router";

import { RequestTransactions, RequestTotalTransactionCount } from "../../request";
import "./Transactions.scss";
import { TransactionDoc, Type, AssetMintTransactionDoc, AssetTransferTransactionDoc } from "../../../db/DocType";
import { TypeBadge } from "../../components/util/TypeBadge/TypeBadge";
import HexString from "../../components/util/HexString/HexString";
import { ImageLoader } from "../../components/util/ImageLoader/ImageLoader";

interface State {
    transactions: TransactionDoc[];
    totalTransactionCount?: number;
    isTransactionRequested: boolean;
    redirect: boolean;
    redirectPage?: number;
    redirectItemsPerPage?: number;
}

interface Props {
    location: {
        search: string;
    };
}

class Transactions extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            transactions: [],
            totalTransactionCount: undefined,
            isTransactionRequested: false,
            redirect: false,
            redirectItemsPerPage: undefined,
            redirectPage: undefined
        };
    }

    public componentWillReceiveProps(props: Props) {
        const { location: { search } } = this.props;
        const { location: { search: nextSearch } } = props;
        if (nextSearch !== search) {
            this.setState({ isTransactionRequested: false, redirect: false, redirectPage: undefined, redirectItemsPerPage: undefined });
        }
    }

    public render() {
        const { location: { search } } = this.props;
        const params = new URLSearchParams(search);
        const currentPage = params.get('page') ? parseInt((params.get('page') as string), 10) : 1;
        const itemsPerPage = params.get('itemsPerPage') ? parseInt((params.get('itemsPerPage') as string), 10) : 5
        const { transactions, totalTransactionCount, isTransactionRequested, redirect, redirectItemsPerPage, redirectPage } = this.state;

        if (redirect) {
            return <Redirect push={true} to={`/txs?page=${redirectPage || currentPage}&itemsPerPage=${redirectItemsPerPage || itemsPerPage}`} />;
        }
        if (!totalTransactionCount) {
            return <RequestTotalTransactionCount onTransactionTotalCount={this.onTotalTransactionCount} onError={this.onError} />;
        }
        const maxPage = Math.floor(Math.max(0, totalTransactionCount - 1) / itemsPerPage) + 1;
        return (
            <Container className="transactions">
                {
                    !isTransactionRequested ?
                        <RequestTransactions onTransactions={this.onTransactions} page={currentPage} itemsPerPage={itemsPerPage} onError={this.onError} />
                        : null
                }
                <h1>Latest transactions</h1>
                <div className="transaction-table">
                    <div>
                        <div>
                            <div className="float-right">
                                <span>Show </span>
                                <select onChange={this.handleOptionChange} defaultValue={itemsPerPage.toString()}>
                                    <option value="5">5</option>
                                    <option value="10">10</option>
                                    <option value="25">25</option>
                                    <option value="50">50</option>
                                    <option value="100">100</option>
                                </select>
                                <span> entries</span>
                            </div>
                        </div>
                        <div>
                            <Table striped={true} className="data-table">
                                <thead>
                                    <tr>
                                        <th style={{ width: '20%' }}>Type</th>
                                        <th style={{ width: '20%' }}>Hash</th>
                                        <th style={{ width: '25%' }}>Assets</th>
                                        <th style={{ width: '15%' }}>Amount</th>
                                        <th style={{ width: '20%' }}>Age</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        _.map(transactions, (transaction) => {
                                            return (
                                                <tr key={`transaction-${transaction.data.hash}`}>
                                                    <td><TypeBadge transaction={transaction} /></td>
                                                    <td scope="row"><HexString link={`/tx/0x${transaction.data.hash}`} text={transaction.data.hash} /></td>
                                                    <td>{
                                                        Type.isAssetMintTransactionDoc(transaction) ?
                                                            <span>
                                                                {
                                                                    Type.getMetadata((transaction as AssetMintTransactionDoc).data.metadata).icon_url ?
                                                                        <ImageLoader className="mr-2" url={Type.getMetadata((transaction as AssetMintTransactionDoc).data.metadata).icon_url} size={18} />
                                                                        : <ImageLoader className="mr-2" data={(transaction as AssetMintTransactionDoc).data.output.assetType} size={18} />
                                                                }
                                                                <HexString link={`/asset/0x${(transaction as AssetMintTransactionDoc).data.output.assetType}`} text={(transaction as AssetMintTransactionDoc).data.output.assetType} />
                                                            </span>
                                                            : (Type.isAssetTransferTransactionDoc(transaction) ?
                                                                <span>
                                                                    {
                                                                        Type.getMetadata((transaction as AssetTransferTransactionDoc).data.inputs[0].prevOut.assetScheme.metadata).icon_url ?
                                                                            <ImageLoader className="mr-2" url={Type.getMetadata((transaction as AssetTransferTransactionDoc).data.inputs[0].prevOut.assetScheme.metadata).icon_url} size={18} />
                                                                            : <ImageLoader className="mr-2" data={(transaction as AssetTransferTransactionDoc).data.inputs[0].prevOut.assetType} size={18} />
                                                                    }
                                                                    <HexString link={`/asset/0x${(transaction as AssetTransferTransactionDoc).data.inputs[0].prevOut.assetType}`} text={(transaction as AssetTransferTransactionDoc).data.inputs[0].prevOut.assetType} />
                                                                </span>
                                                                : "")
                                                    }
                                                    </td>
                                                    <td>{Type.isAssetMintTransactionDoc(transaction) ? ((transaction as AssetMintTransactionDoc).data.output.amount ? ((transaction as AssetMintTransactionDoc).data.output.amount as number).toLocaleString() : 0) : (Type.isAssetTransferTransactionDoc(transaction) ? _.sumBy((transaction as AssetTransferTransactionDoc).data.inputs, (input) => input.prevOut.amount) : "").toLocaleString()}</td>
                                                    <td>{moment.unix(transaction.data.timestamp).fromNow()}</td>
                                                </tr>
                                            );
                                        })
                                    }
                                </tbody>
                            </Table>
                        </div>
                        <div className="d-flex mt-small">
                            <div className="d-inline ml-auto pager">
                                <ul className="list-inline">
                                    <li className="list-inline-item">
                                        <button className={`btn btn-primary page-btn ${currentPage === 1 ? "disabled" : ""}`} type="button" onClick={_.partial(this.moveFirst, currentPage)}>&lt;&lt;</button>
                                    </li>
                                    <li className="list-inline-item">
                                        <button className={`btn btn-primary page-btn ${currentPage === 1 ? "disabled" : ""}`} type="button" onClick={_.partial(this.moveBefore, currentPage)}>&lt; Prev</button>
                                    </li>
                                    <li className="list-inline-item">
                                        <div className="number-view">
                                            {currentPage} of {maxPage}
                                        </div>
                                    </li>
                                    <li className="list-inline-item">
                                        <button className={`btn btn-primary page-btn ${currentPage === maxPage ? "disabled" : ""}`} type="button" onClick={_.partial(this.moveNext, currentPage, maxPage)}>Next &gt;</button>
                                    </li>
                                    <li className="list-inline-item">
                                        <button className={`btn btn-primary page-btn ${currentPage === maxPage ? "disabled" : ""}`} type="button" onClick={_.partial(this.moveLast, currentPage, maxPage)}>&gt;&gt;</button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        );
    }
    private moveNext = (currentPage: number, maxPage: number, e: any) => {
        e.preventDefault();
        if (currentPage >= maxPage) {
            return;
        }
        this.setState({ redirectPage: currentPage + 1, redirect: true });
    }

    private moveLast = (currentPage: number, maxPage: number, e: any) => {
        e.preventDefault();
        if (currentPage >= maxPage) {
            return;
        }
        this.setState({ redirectPage: maxPage, redirect: true })
    }

    private moveBefore = (currentPage: number, e: any) => {
        e.preventDefault();
        if (currentPage <= 1) {
            return;
        }
        this.setState({ redirectPage: currentPage - 1, redirect: true })
    }

    private moveFirst = (currentPage: number, e: any) => {
        if (currentPage <= 1) {
            return;
        }
        this.setState({ redirectPage: 1, redirect: true })
    }

    private handleOptionChange = (event: any) => {
        const selected = parseInt(event.target.value, 10);
        this.setState({ redirectItemsPerPage: selected, redirect: true, redirectPage: 1 });
    }

    private onTotalTransactionCount = (totalTransactionCount: number) => {
        this.setState({ totalTransactionCount });
    }

    private onTransactions = (transactions: TransactionDoc[]) => {
        this.setState({ transactions, isTransactionRequested: true });
    };

    private onError = (error: any) => {
        console.log(error);
        this.setState({ transactions: [], isTransactionRequested: true });
    };
}

export default Transactions;
