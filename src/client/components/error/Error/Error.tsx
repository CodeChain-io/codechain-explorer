import * as React from "react";
import { Col, Container, Row } from "reactstrap";
import "./Error.scss";
import * as errorMonster from "./img/error-monster.png";

interface Props {
    title: string;
    content: string;
    className?: string;
}

export const Error = (props: Props) => {
    const { className, title, content } = props;
    return (
        <Container className={`error ${className}`}>
            <Row>
                <Col md="4" className="text-center">
                    <img src={errorMonster} className="error-monster" />
                </Col>
                <Col md="8" className="d-flex align-items-center">
                    <div>
                        <h1 className="mb-2">Error!</h1>
                        <h2 className="mb-3 sub-title">We can’t find the page you’re looking for.</h2>
                        <p className="title mb-1 text-danger">{title}</p>
                        <p className="content">{content}</p>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};
