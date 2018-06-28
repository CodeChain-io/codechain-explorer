import * as React from "react";
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { IndexLinkContainer } from 'react-router-bootstrap';
import HealthChecker from '../util/HealthChecker';

class Header extends React.Component<{}> {
    constructor(props: {}) {
        super(props);
        this.state = {};
    }

    public render() {
        return <div>
            <Navbar>
                <Navbar.Header>
                    <IndexLinkContainer to="/">
                        <Navbar.Brand>
                            CodeChain Explorer
                        </Navbar.Brand>
                    </IndexLinkContainer>
                </Navbar.Header>
                <Nav>
                    <IndexLinkContainer to="/">
                        <NavItem eventKey={1}>
                            Home
                        </NavItem>
                    </IndexLinkContainer>
                    <IndexLinkContainer to="/send_signed_parcel">
                        <NavItem eventKey={2}>
                            Send Parcel
                         </NavItem>
                    </IndexLinkContainer>
                    <IndexLinkContainer to="/node_info">
                        <NavItem eventKey={3}>
                            Node Info
                        </NavItem>
                    </IndexLinkContainer>
                </Nav>
                <Nav pullRight={true}>
                    <NavItem>
                        <HealthChecker />
                    </NavItem>
                </Nav>
            </Navbar>
        </div>
    }
}

export default Header;
