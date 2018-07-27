import * as React from "react";
import { Container } from "reactstrap";
import "./Footer.scss";

const Footer = () => {
    return <div className="footer">
        <Container>
            <div className="text-center">
                <p>codechain@kodebox.io</p>
                <p className="mb-0">ⓒ 2018 Kodebox, Inc.</p>
            </div>
        </Container>
    </div>
}

export default Footer;
