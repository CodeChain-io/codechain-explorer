import * as React from "react";
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import { IndexLinkContainer } from 'react-router-bootstrap';
import HealthChecker from '../util/HealthChecker';
import Search from '../search/Search';

import './Header.css';

class Header extends React.Component<{}> {
    constructor(props: {}) {
        super(props);
        this.state = {};
    }

    public render() {
        return <div>
            <Navbar collapseOnSelect={true}>
                <Navbar.Header>
                    <IndexLinkContainer to="/">
                        <Navbar.Brand>
                            CodeChain Explorer
                        </Navbar.Brand>
                    </IndexLinkContainer>
                    <Navbar.Toggle />
                </Navbar.Header>
                <Navbar.Collapse>
                    <Nav>
                        <IndexLinkContainer to="/">
                            <NavItem eventKey={1}>
                                Home
                        </NavItem>
                        </IndexLinkContainer>
                        <NavDropdown eventKey={2} title="Blockchain" id="basic-nav-dropdown">
                            <MenuItem eventKey={2.1}>
                                Latest Blocks
                        </MenuItem>
                            <MenuItem eventKey={2.2}>
                                Latest Transactions
                        </MenuItem>
                            <MenuItem eventKey={2.3}>
                                Latest Parcels
                        </MenuItem>
                            <MenuItem divider={true} />
                            <MenuItem eventKey={2.4}>
                                Pending Parcels
                        </MenuItem>
                        </NavDropdown>
                        <NavItem eventKey={3}>
                            Status
                        </NavItem>
                        <NavDropdown eventKey={4} title="MISC" id="basic-nav-dropdown">
                            <IndexLinkContainer to="/send_signed_parcel">
                                <MenuItem eventKey={4.1}>
                                    Broadcast Parcel
                            </MenuItem>
                            </IndexLinkContainer>
                            <MenuItem eventKey={4.2}>
                                API
                        </MenuItem>
                        </NavDropdown>
                        <NavItem>
                            <HealthChecker />
                        </NavItem>
                    </Nav>
                    <Nav pullRight={true}>
                        <NavItem>
                            <Search />
                        </NavItem>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </div>
    }
}

export default Header;
