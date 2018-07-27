import * as React from "react";
import { match } from "react-router";
import { Container } from "reactstrap";

import { RequestBlock } from "../../request";
import BlockDetails from "../../components/block/BlockDetails/BlockDetails";
import BlockParcelList from "../../components/block/BlockParcelList/BlockParcelList";

import "./Block.scss";
import { BlockDoc } from "../../../db/DocType";
import { Link } from "react-router-dom";

interface State {
    block?: BlockDoc;
    page: number;
}

interface Props {
    match: match<{ id: number | string }>;
}

class Block extends React.Component<Props, State> {
    private itemPerPage = 3;
    constructor(props: Props) {
        super(props);
        this.state = {
            page: 1
        };
    }

    public componentWillReceiveProps(props: Props) {
        const { match: { params: { id } } } = this.props;
        const { match: { params: { id: nextId } } } = props;
        if (nextId !== id) {
            this.setState({ block: undefined, page: 1 });
        }
    }

    public render() {
        const { match: { params: { id } } } = this.props;
        const { block, page } = this.state;

        if (!block) {
            return <RequestBlock id={id} onBlock={this.onBlock} onError={this.onError} onBlockNotExist={this.onBlockNotExist} />;
        }
        return (
            <Container className="block">
                <div className="d-flex">
                    <h1 className="d-inline mr-auto">#{block.number} Block Infomation</h1>
                    <div className="d-inline d-flex align-items-center">
                        <span className="mr-5"><Link to={`/block/${block.number - 1}`} className={block.number === 0 ? "disabled-link" : ""}>&lt; Prev</Link></span>
                        <span><Link to={`/block/${block.number + 1}`}>Next &gt;</Link></span>
                    </div>
                </div>
                <BlockDetails block={block} />
                <div className="parcel-count-label">
                    <span className="blue-color">{block.parcels.length} Parcels</span> in this Block
                </div>
                <div className="mt-3">
                    <BlockParcelList parcels={block.parcels.slice(0, this.itemPerPage * page)} />
                    {
                        this.itemPerPage * page < block.parcels.length ?
                            <div className="mt-3">
                                <div className="load-more-btn mx-auto">
                                    <a href="#" onClick={this.loadMore}>
                                        <h3>Load Parcels</h3>
                                    </a>
                                </div>
                            </div>
                            : null
                    }
                </div>
            </Container>
        );
    }

    private loadMore = (e: any) => {
        e.preventDefault();
        this.setState({ page: this.state.page + 1 })
    }

    private onBlockNotExist = () => {
        // TODO
    }

    private onBlock = (block: BlockDoc) => {
        this.setState({ block });
    };

    private onError = () => ({});
}

export default Block;
