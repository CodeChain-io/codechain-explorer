import * as React from "react";
import { Container, Navbar, NavbarBrand, NavbarToggler, Nav, NavItem, NavLink, Collapse, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import { IndexLinkContainer } from "react-router-bootstrap";
import LoadingBar from "react-redux-loading-bar";
import HealthChecker from "../../util/HealthChecker/HealthChecker";
import Search from "../Search/Search";

import * as logo from "./img/logo.png";

import "./Header.scss";

interface State {
    isOpen: boolean;
}

class Header extends React.Component<{}, State> {
    constructor(props: {}) {
        super(props);
        this.toggle = this.toggle.bind(this);
        this.state = {
            isOpen: false
        };
    }

    public render() {
        return <div className="header">
            <Navbar className="header-container" dark={true} expand="lg">
                <Container>
                    <IndexLinkContainer to="/">
                        <NavbarBrand>
                            <img src={logo} className="logo" /> CodeChain Explorer
                        </NavbarBrand>
                    </IndexLinkContainer>
                    <NavbarToggler onClick={this.toggle} />
                    <Collapse isOpen={this.state.isOpen} navbar={true}>
                        <Nav navbar={true} className="mr-auto">
                            <IndexLinkContainer to="/">
                                <NavItem>
                                    <NavLink>Home</NavLink>
                                </NavItem>
                            </IndexLinkContainer>
                            <UncontrolledDropdown nav={true} inNavbar={true}>
                                <DropdownToggle nav={true} caret={true}>
                                    Explorer
                                </DropdownToggle>
                                <DropdownMenu right={false}>
                                    <IndexLinkContainer to="/blocks">
                                        <DropdownItem>
                                            Latest Blocks
                                        </DropdownItem>
                                    </IndexLinkContainer>
                                    <IndexLinkContainer to="/parcels">
                                        <DropdownItem>
                                            Latest Parcels
                                        </DropdownItem>
                                    </IndexLinkContainer>
                                    <IndexLinkContainer to="/txs">
                                        <DropdownItem>
                                            Latest Transactions
                                        </DropdownItem>
                                    </IndexLinkContainer>
                                    <IndexLinkContainer to="/parcels-pending">
                                        <DropdownItem>
                                            Pending Parcels
                                        </DropdownItem>
                                    </IndexLinkContainer>
                                </DropdownMenu>
                            </UncontrolledDropdown>
                            <NavItem>
                                <NavLink className="health-checker">
                                    <HealthChecker />
                                </NavLink>
                            </NavItem>
                            {
                                /*
                                <IndexLinkContainer to="/node_info">
                                    <NavItem>
                                        <NavLink>Status</NavLink>
                                    </NavItem>
                                </IndexLinkContainer>
                                <UncontrolledDropdown nav={true} inNavbar={true}>
                                <DropdownToggle nav={true} caret={true}>
                                    MISC
                                </DropdownToggle>
                                <DropdownMenu right={true}>
                                    <IndexLinkContainer to="/send_signed_parcel">
                                        <DropdownItem>
                                            Broadcast Parcel
                                        </DropdownItem>
                                    </IndexLinkContainer>
                                    <DropdownItem>
                                        API
                                    </DropdownItem>
                                </DropdownMenu>
                                </UncontrolledDropdown>
                                */
                            }
                        </Nav>
                        <Nav>
                            <NavItem className="search-for-large-screen">
                                <Search />
                            </NavItem>
                        </Nav>
                    </Collapse>
                </Container>
            </Navbar>
            <Container className="searchbar-container search-for-small-screen">
                <Search className="ml-auto" />
            </Container>
            <LoadingBar className="loading-bar" />
        </div>
    }

    private toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }
}

export default Header;
