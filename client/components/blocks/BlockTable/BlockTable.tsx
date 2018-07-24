import * as React from "react";
import * as _ from "lodash";
import * as moment from "moment";
import { Table } from 'reactstrap';

import "./BlockTable.scss";
import { BlockDoc } from "../../../db/DocType";
import HexString from "../../util/HexString/HexString";
import { Link } from "react-router-dom";

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
        const maxPage = Math.floor(blocks.length / (itemPerPage + 1)) + 1;
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
                            <span> entities</span>
                        </div>
                    </div>
                    <div>
                        <Table striped={true}>
                            <thead>
                                <tr>
                                    <th>No.</th>
                                    <th>Parcels</th>
                                    <th>Reward</th>
                                    <th>Author</th>
                                    <th>Age</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    _.map(blocks.slice((currentPage - 1) * itemPerPage, (currentPage - 1) * itemPerPage + itemPerPage), (block) => {
                                        return (
                                            <tr key={`block-${block.hash}`}>
                                                <td scope="row"><Link to={`/block/${block.number}`}>{block.number}</Link></td>
                                                <td>{block.parcels.length}</td>
                                                <td>{10000}</td>
                                                <td><HexString link={`/addr-platform/0x${block.author}`} text={block.author} length={10} /></td>
                                                <td>{moment.unix(block.timestamp).fromNow()}</td>
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

export default BlockTable;
