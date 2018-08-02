import * as React from "react";
import * as _ from "lodash";
import * as moment from "moment";
import { Table } from "reactstrap";

import "./TransactionTable.scss";
import { TransactionDoc, Type, AssetMintTransactionDoc, AssetTransferTransactionDoc } from "../../../../db/DocType";
import HexString from "../../util/HexString/HexString";
import { TypeBadge } from "../../../utils/TypeBadge/TypeBadge";

interface Prop {
    transactions: TransactionDoc[];
}

interface State {
    itemPerPage: number,
    currentPage: number
}

class TransactionTable extends React.Component<Prop, State> {
    constructor(props: Prop) {
        super(props);
        this.state = {
            currentPage: 1,
            itemPerPage: 5
        };
    }

    public render() {
        const { transactions } = this.props;
        const { currentPage, itemPerPage } = this.state;
        const maxPage = Math.floor(Math.max(0, transactions.length - 1) / itemPerPage) + 1;
        return (
            <div className="transaction-table">
                <div>
                    <div>
                        <div className="float-right">
                            <span>Show </span>
                            <select onChange={this.handleOptionChange} defaultValue={itemPerPage.toString()}>
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
                                    _.map(transactions.slice((currentPage - 1) * itemPerPage, (currentPage - 1) * itemPerPage + itemPerPage), (transaction) => {
                                        return (
                                            <tr key={`transaction-${transaction.data.hash}`}>
                                                <td><TypeBadge transaction={transaction} /></td>
                                                <td scope="row"><HexString link={`/tx/0x${transaction.data.hash}`} text={transaction.data.hash} /></td>
                                                <td>{Type.isAssetMintTransactionDoc(transaction) ?
                                                    <HexString link={`/asset/${(transaction as AssetMintTransactionDoc).data.output.assetType}`} text={(transaction as AssetMintTransactionDoc).data.output.assetType} />
                                                    : (Type.isAssetTransferTransactionDoc(transaction) ? <HexString link={`/asset/0x${(transaction as AssetTransferTransactionDoc).data.inputs[0].prevOut.assetType}`} text={(transaction as AssetTransferTransactionDoc).data.inputs[0].prevOut.assetType} /> : "")}</td>
                                                <td>{Type.isAssetMintTransactionDoc(transaction) ? ((transaction as AssetMintTransactionDoc).data.output.amount ? ((transaction as AssetMintTransactionDoc).data.output.amount as number).toLocaleString() : 0) : (Type.isAssetTransferTransactionDoc(transaction) ? _.sumBy((transaction as AssetTransferTransactionDoc).data.inputs, (input) => input.prevOut.amount) : "").toLocaleString()}</td>
                                                <td>{moment.unix(transaction.data.timestamp).fromNow()}</td>
                                            </tr>
                                        );
                                    })
                                }
                            </tbody>
                        </Table>
                    </div>
                    <div className="d-flex mt-3">
                        <div className="d-inline ml-auto pager">
                            <ul className="list-inline">
                                <li className="list-inline-item">
                                    <button className={`btn btn-primary page-btn ${currentPage === 1 ? "disabled" : ""}`} type="button" onClick={this.moveFirst}>&lt;&lt;</button>
                                </li>
                                <li className="list-inline-item">
                                    <button className={`btn btn-primary page-btn ${currentPage === 1 ? "disabled" : ""}`} type="button" onClick={this.moveBefore}>&lt; Prev</button>
                                </li>
                                <li className="list-inline-item">
                                    <div className="number-view">
                                        {currentPage} of {maxPage}
                                    </div>
                                </li>
                                <li className="list-inline-item">
                                    <button className={`btn btn-primary page-btn ${currentPage === maxPage ? "disabled" : ""}`} type="button" onClick={_.partial(this.moveNext, maxPage)}>Next &gt;</button>
                                </li>
                                <li className="list-inline-item">
                                    <button className={`btn btn-primary page-btn ${currentPage === maxPage ? "disabled" : ""}`} type="button" onClick={_.partial(this.moveLast, maxPage)}>&gt;&gt;</button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    private moveNext = (maxPage: number, e: any) => {
        e.preventDefault();
        if (this.state.currentPage >= maxPage) {
            return;
        }
        this.setState({ currentPage: this.state.currentPage + 1 })
    }

    private moveLast = (maxPage: number, e: any) => {
        e.preventDefault();
        if (this.state.currentPage >= maxPage) {
            return;
        }
        this.setState({ currentPage: maxPage })
    }

    private moveBefore = (e: any) => {
        e.preventDefault();
        if (this.state.currentPage <= 1) {
            return;
        }
        this.setState({ currentPage: this.state.currentPage - 1 })
    }

    private moveFirst = (e: any) => {
        if (this.state.currentPage <= 1) {
            return;
        }
        this.setState({ currentPage: 1 })
    }

    private handleOptionChange = (event: any) => {
        const selected = parseInt(event.target.value, 10);
        this.setState({ itemPerPage: selected, currentPage: 1 });
    }
}

export default TransactionTable;
