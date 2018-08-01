import * as React from "react";
import * as _ from "lodash";
import * as moment from "moment";
import { Table } from "reactstrap";

import "./TransactionTable.scss";
import { TransactionDoc, Type, AssetMintTransactionDoc, AssetTransferTransactionDoc } from "../../../../db/DocType";
import HexString from "../../util/HexString/HexString";

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
        const maxPage = Math.floor(transactions.length / (itemPerPage + 1)) + 1;
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
                        <Table striped={true}>
                            <thead>
                                <tr>
                                    <th>Type</th>
                                    <th>Hash</th>
                                    <th>Assets</th>
                                    <th>Amount</th>
                                    <th>Age</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    _.map(transactions.slice((currentPage - 1) * itemPerPage, (currentPage - 1) * itemPerPage + itemPerPage), (transaction) => {
                                        const transactionType = transaction.type;
                                        return (
                                            <tr key={`transaction-${transaction.data.hash}`}>
                                                <td><div className={`transaction-type text-center ${transactionType === "assetMint" ? "asset-mint-type" : "asset-transfer-type"}`}>{transactionType}</div></td>
                                                <td scope="row"><HexString link={`/tx/0x${transaction.data.hash}`} text={transaction.data.hash} /></td>
                                                <td>{Type.isAssetMintTransactionDoc(transaction) ?
                                                    <HexString link={`/asset/${(transaction as AssetMintTransactionDoc).data.output.assetType}`} text={(transaction as AssetMintTransactionDoc).data.output.assetType} />
                                                    : (Type.isAssetTransferTransactionDoc(transaction) ? <HexString link={`/asset/0x${(transaction as AssetTransferTransactionDoc).data.inputs[0].prevOut.assetType}`} text={(transaction as AssetTransferTransactionDoc).data.inputs[0].prevOut.assetType} /> : "")}</td>
                                                <td>{Type.isAssetMintTransactionDoc(transaction) ? (transaction as AssetMintTransactionDoc).data.output.amount : (Type.isAssetTransferTransactionDoc(transaction) ? _.sumBy((transaction as AssetTransferTransactionDoc).data.inputs, (input) => input.prevOut.amount) : "")}</td>
                                                <td>{moment.unix(transaction.data.timestamp).fromNow()}</td>
                                            </tr>
                                        );
                                    })
                                }
                            </tbody>
                        </Table>
                    </div>
                    <div className="d-flex mt-3">
                        <div className="d-inline ml-auto">
                            <ul className="list-inline">
                                <li className={`list-inline-item page-btn ${currentPage === 1 ? "disable" : ""}`} onClick={this.moveFirst}>
                                    &lt;&lt;
                                </li>
                                <li className={`list-inline-item page-btn ${currentPage === 1 ? "disable" : ""}`} onClick={this.moveBefore}>
                                    &lt; Prev
                                </li>
                                <li className="list-inline-item">
                                    {currentPage} of {maxPage}
                                </li>
                                <li className={`list-inline-item page-btn ${currentPage === maxPage ? "disable" : ""}`} onClick={_.partial(this.moveNext, maxPage)}>
                                    Next &gt;
                                </li>
                                <li className={`list-inline-item page-btn ${currentPage === maxPage ? "disable" : ""}`} onClick={_.partial(this.moveLast, maxPage)}>
                                    &gt;&gt;
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
        const selected = event.target.value;
        this.setState({ itemPerPage: selected, currentPage: 1 });
    }
}

export default TransactionTable;
