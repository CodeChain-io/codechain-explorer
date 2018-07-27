import * as React from "react";
import { Container } from 'reactstrap';

import "./NotFound.scss";

interface Props {
    location: any;
}

class NotFound extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
    }

    public render() {
        const { location } = this.props;
        return (
            <Container className="not-found">
                <h1>404 Not Found</h1>
                <h3>Invalid path : {location.pathname}</h3>
            </Container>
        );
    }
}

export default NotFound;
