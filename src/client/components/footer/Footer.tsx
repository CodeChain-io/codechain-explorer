import * as React from "react";
import { Container, Row, Col } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faGitter, faTwitter, faMedium } from "@fortawesome/free-brands-svg-icons"
import "./Footer.scss";

const Footer = () => {
    return <div className="footer">
        <Container>
            <Row>
                <Col lg="9">
                    <ul className="mb-3 mb-lg-0 home-link-list">
                        <li><a href="https://codechain.io" target="_blank">codechain.io</a></li>
                        <li>codechain@kodebox.io</li>
                        <li>Powered by Kodebox, Inc.</li>
                    </ul>
                </Col>
                <Col lg="3">
                    <ul className="list-inline link-list">
                        <li className="list-inline-item"><a href="https://github.com/CodeChain-io/codechain" target="_blank"><FontAwesomeIcon icon={faGithub} /></a></li>
                        <li className="list-inline-item"><a href="https://gitter.im/CodeChain-io/codechain" target="_blank"><FontAwesomeIcon icon={faGitter} /></a></li>
                        <li className="list-inline-item"><a href="https://twitter.com/codechain_io" target="_blank"><FontAwesomeIcon icon={faTwitter} /></a></li>
                        <li className="list-inline-item"><a href="https://medium.com/codechain" target="_blank"><FontAwesomeIcon icon={faMedium} /></a></li>
                    </ul>
                </Col>
            </Row>
        </Container>
    </div>
}

export default Footer;
