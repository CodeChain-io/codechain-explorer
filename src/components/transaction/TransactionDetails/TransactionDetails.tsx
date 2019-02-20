import * as _ from "lodash";
import * as React from "react";

import { Col, Row } from "reactstrap";

import { TransactionDoc } from "codechain-indexer-types";
import DataSet from "../../util/DataSet/DataSet";
import CommonDetails from "./CommonDetails/CommonDetails";
import DetailsByType from "./DetailsByType/DetailsByType";
import MoreInfo from "./MoreInfo/MoreInfo";
import "./TransactionDetails.scss";

interface Props {
    transaction: TransactionDoc;
}

export default class TransactionDetails extends React.Component<Props> {
    public render() {
        const { transaction } = this.props;
        return (
            <div className="transaction-details">
                <Row>
                    <Col lg="12">
                        <h2>Details</h2>
                        <hr className="heading-hr" />
                    </Col>
                </Row>
                <Row key="details">
                    <Col lg="12">
                        <DataSet>
                            <CommonDetails tx={transaction} />
                            <DetailsByType tx={transaction} />
                        </DataSet>
                    </Col>
                </Row>
                <MoreInfo tx={transaction} />
            </div>
        );
    }
}
