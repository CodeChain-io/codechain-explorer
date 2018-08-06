import * as React from "react";
import { Container, Row, Col } from "reactstrap";
import * as FontAwesome from "react-fontawesome";
import "./Footer.scss";
import * as Logo from "./img/logo.png";
import * as GitterIcon from "./img/gitter.png";

const Footer = () => {
    return <div className="footer">
        <Container>
            <Row>
                <Col lg="4">
                    <img src={Logo} className="logo" />
                    <p className="copyright">&copy; 2018 Kodebox,Inc. All Rights Reserved.</p>
                </Col>
                <Col lg="5">
                    <ul className="mb-3 mb-lg-0 home-link-list">
                        <li><a href="https://codechain.io" target="_blank">codechain.io</a></li>
                        <li><a href="https://kodebox.io" target="_blank">kodebox.io</a></li>
                        <li>codechain@kodebox.io</li>
                    </ul>
                </Col>
                <Col lg="3">
                    <ul className="list-inline link-list">
                        <li className="list-inline-item"><a href="https://github.com/CodeChain-io/codechain" target="_blank"><FontAwesome name="github" /></a></li>
                        <li className="list-inline-item"><a href="https://gitter.im/CodeChain-io/codechain" target="_blank"><img src={GitterIcon} className="gitter-icon" /></a></li>
                        <li className="list-inline-item"><a href="https://twitter.com/codechain_io" target="_blank"><FontAwesome name="twitter" /></a></li>
                        <li className="list-inline-item"><a href="https://www.facebook.com/codechain/" target="_blank"><FontAwesome name="facebook-square" /></a></li>
                    </ul>
                </Col>
            </Row>
        </Container>
    </div>
}

export default Footer;
