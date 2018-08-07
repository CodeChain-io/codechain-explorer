import * as React from "react";
import * as _ from "lodash";
import * as moment from "moment";
import { Redirect } from "react-router";
import { Container, Table } from "reactstrap";
import { BlockDoc } from "../../../db/DocType";
import { Link } from "react-router-dom";
import { PlatformAddress } from "codechain-sdk/lib/key/classes";
import { RequestTotalBlockCount, RequestBlocks } from "../../request";
import "./Blocks.scss";

interface State {
    blocks: BlockDoc[];
    totalBlockCount?: number;
    isBlockRequested: boolean;
    redirect: boolean;
    redirectPage?: number;
    redirectItemsPerPage?: number;
}

interface Props {
    location: {
        search: string;
    };
}

class Blocks extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            blocks: [],
            totalBlockCount: undefined,
            isBlockRequested: false,
            redirect: false,
            redirectItemsPerPage: undefined,
            redirectPage: undefined
        };
    }

    public componentWillReceiveProps(props: Props) {
        const { location: { search } } = this.props;
        const { location: { search: nextSearch } } = props;
        if (nextSearch !== search) {
            this.setState({ isBlockRequested: false, redirect: false, redirectPage: undefined, redirectItemsPerPage: undefined });
        }
    }

    public render() {
        const { location: { search } } = this.props;
        const params = new URLSearchParams(search);
        const currentPage = params.get('page') ? parseInt((params.get('page') as string), 10) : 1;
        const itemsPerPage = params.get('itemsPerPage') ? parseInt((params.get('itemsPerPage') as string), 10) : 5
        const { blocks, totalBlockCount, isBlockRequested, redirect, redirectItemsPerPage, redirectPage } = this.state;

        if (redirect) {
            return <Redirect push={true} to={`/blocks?page=${redirectPage || currentPage}&itemsPerPage=${redirectItemsPerPage || itemsPerPage}`} />;
        }
        if (!totalBlockCount) {
            return <RequestTotalBlockCount onBlockTotalCount={this.onTotalBlockCount} onError={this.onError} />;
        }
        const maxPage = Math.floor(Math.max(0, totalBlockCount - 1) / itemsPerPage) + 1;
        return (
            <Container className="blocks">
                {
                    !isBlockRequested ?
                        <RequestBlocks onBlocks={this.onBlocks} page={currentPage} itemsPerPage={itemsPerPage} onError={this.onError} />
                        : null
                }
                <h1>Latest blocks</h1>
                <div className="block-table">
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
                                        <th style={{ width: '15%' }}>No.</th>
                                        <th style={{ width: '15%' }}>Parcels</th>
                                        <th style={{ width: '35%' }}>Author</th>
                                        <th style={{ width: '15%' }}>Reward</th>
                                        <th style={{ width: '20%' }}>Age</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        _.map(blocks, (block) => {
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

    private onTotalBlockCount = (totalBlockCount: number) => {
        this.setState({ totalBlockCount });
    }

    private onBlocks = (blocks: BlockDoc[]) => {
        this.setState({ blocks, isBlockRequested: true });
    }

    private onError = (error: any) => {
        this.setState({ blocks: [], isBlockRequested: true });
        console.log(error);
    }
}

export default Blocks;
