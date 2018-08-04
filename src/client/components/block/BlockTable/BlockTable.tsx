import * as React from "react";
import * as _ from "lodash";
import * as moment from "moment";
import { Table } from "reactstrap";

import "./BlockTable.scss";
import { BlockDoc } from "../../../../db/DocType";
import { Link } from "react-router-dom";
import { PlatformAddress } from "codechain-sdk/lib/key/classes";

interface Prop {
    blocks: BlockDoc[];
}

interface State {
    itemPerPage: number,
    currentPage: number
}

class BlockTable extends React.Component<Prop, State> {
    constructor(props: Prop) {
        super(props);
        this.state = {
            currentPage: 1,
            itemPerPage: 5
        };
    }

    public render() {
        const { blocks } = this.props;
        const { currentPage, itemPerPage } = this.state;
        const maxPage = Math.floor(Math.max(0, blocks.length - 1) / itemPerPage) + 1;
        return (
            <div className="block-table">
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
                                    <th style={{ width: '15%' }}>No.</th>
                                    <th style={{ width: '15%' }}>Parcels</th>
                                    <th style={{ width: '35%' }}>Author</th>
                                    <th style={{ width: '15%' }}>Reward</th>
                                    <th style={{ width: '20%' }}>Age</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    _.map(blocks.slice((currentPage - 1) * itemPerPage, (currentPage - 1) * itemPerPage + itemPerPage), (block) => {
                                        return (
                                            <tr key={`block-${block.hash}`}>
                                                <td scope="row"><Link to={`/block/${block.number}`}>{block.number.toLocaleString()}</Link></td>
                                                <td>{block.parcels.length.toLocaleString()}</td>
                                                <td><Link to={`/addr-platform/${PlatformAddress.fromAccountId(block.author).value}`}>{PlatformAddress.fromAccountId(block.author).value}</Link></td>
                                                <td>{(10000).toLocaleString()}</td>
                                                <td>{moment.unix(block.timestamp).fromNow()}</td>
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

export default BlockTable;
