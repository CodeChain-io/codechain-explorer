import * as React from "react";
import * as moment from "moment";
import * as FontAwesome from "react-fontawesome";
import { match } from "react-router";
import { Container, Col, Row } from "reactstrap";

import { RequestBlock } from "../../request";
import BlockDetails from "../../components/block/BlockDetails/BlockDetails";
import ParcelList from "../../components/parcel/ParcelList/ParcelList";

import "./Block.scss";
import { BlockDoc } from "../../../db/DocType";
import { Link } from "react-router-dom";
import HexString from "../../components/util/HexString/HexString";

interface State {
    block?: BlockDoc;
    notFound: boolean;
}

interface Props {
    match: match<{ id: number | string }>;
}

class Block extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            notFound: false
        };
    }

    public componentWillReceiveProps(props: Props) {
        const { match: { params: { id } } } = this.props;
        const { match: { params: { id: nextId } } } = props;
        if (nextId !== id) {
            this.setState({ block: undefined, notFound: false });
        }
    }

    public render() {
        const { match: { params: { id } } } = this.props;
        const { block, notFound } = this.state;

        if (!block) {
            return <RequestBlock id={id} onBlock={this.onBlock} onError={this.onError} onBlockNotExist={this.onBlockNotExist} />;
        }
        if (notFound) {
            return <div>{id} not found.</div>
        }
        return (
            <Container className="block">
                <Row className="mb-2">
                    <Col md="8" xl="7">
                        <div className="d-flex align-items-end title-container">
                            <h1 className="d-inline-block mr-auto">Block <span className="block-number">#{block.number}</span></h1>
                            <span className="timestamp">{moment.unix(block.timestamp).format("YYYY-MM-DD HH:mm:ssZ")}</span>
                        </div>
                    </Col>
                </Row>
                <Row className="mb-4">
                    <Col md="8" xl="7" className="hash-container d-flex mb-3 mb-md-0">
                        <div className="d-inline-block hash">
                            <HexString text={block.hash} />
                        </div>
                        <div className="d-inline-block copy text-center">
                            <FontAwesome name="copy" />
                        </div>
                    </Col>
                    <Col md="3" xl="2" className="d-flex align-items-center justify-content-between offset-md-1 offset-xl-3">
                        <Link to={block.number !== 0 ? `/block/${block.number - 1}` : "#"}><button type="button" className={`btn btn-primary ${block.number === 0 ? "disabled" : ""}`}>&lt; Prev</button></Link>
                        <Link to={`/block/${block.number + 1}`}><button type="button" className="btn btn-primary">Next &gt;</button></Link>
                    </Col>
                </Row>
                <BlockDetails block={block} />
                <ParcelList parcels={block.parcels} fullScreen={false} />
            </Container>
        );
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
