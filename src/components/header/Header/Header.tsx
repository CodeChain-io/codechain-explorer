import * as React from "react";
import LoadingBar from "react-redux-loading-bar";
import { IndexLinkContainer } from "react-router-bootstrap";
import {
    Collapse,
    Container,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Nav,
    Navbar,
    NavbarBrand,
    NavbarToggler,
    NavItem,
    NavLink,
    UncontrolledDropdown
} from "reactstrap";
import HealthChecker from "../../util/HealthChecker/HealthChecker";
import Search from "../Search/Search";

import * as logo from "./img/logo-explorer.png";

import { RequestBlockNumber } from "../../../request";
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
        return (
            <div className="header">
                <RequestBlockNumber repeat={2000} onBlockNumber={this.handleRequestBlock} onError={this.handleError} />
                <Navbar className="header-container" dark={true} expand="xl">
                    <Container fluid={true}>
                        <div className="header-title-container">
                            <IndexLinkContainer to="/">
                                <NavbarBrand>
                                    <img src={logo} className="logo" />{" "}
                                    <div className="d-inline-block header-big">
                                        <span id="explorer-title" className="header-title">
                                            {process.env.REACT_APP_HEADER_TITLE}
                                        </span>
                                    </div>
                                    <div className="d-inline-block header-small">
                                        <span className="header-title">{process.env.REACT_APP_HEADER_SHORT_TITLE}</span>
                                    </div>
                                </NavbarBrand>
                            </IndexLinkContainer>
                        </div>
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
                                            <DropdownItem>Latest Blocks</DropdownItem>
                                        </IndexLinkContainer>
                                        <IndexLinkContainer to="/txs">
                                            <DropdownItem>Latest Transactions</DropdownItem>
                                        </IndexLinkContainer>
                                        <IndexLinkContainer to="/pending-txs">
                                            <DropdownItem>Pending Transactions</DropdownItem>
                                        </IndexLinkContainer>
                                    </DropdownMenu>
                                </UncontrolledDropdown>
                                <NavItem>
                                    <IndexLinkContainer to="/status">
                                        <NavLink className="health-checker">
                                            <HealthChecker />
                                        </NavLink>
                                    </IndexLinkContainer>
                                </NavItem>
                            </Nav>
                            <Nav className="mr-3">
                                <NavItem className="search-for-large-screen">
                                    <Search idString="large" />
                                </NavItem>
                            </Nav>
                        </Collapse>
                    </Container>
                </Navbar>
                <Container className="searchbar-container search-for-small-screen">
                    <Search className="ml-auto" idString="small" />
                </Container>
                <LoadingBar className="loading-bar" />
            </div>
        );
    }

    private toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    private handleRequestBlock = () => {
        // nothing
    };
    private handleError = (error: string) => {
        console.log(error);
    };
}

export default Header;
