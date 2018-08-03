import * as React from "react";
import { Error } from "../../components/error/Error/Error";

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
            <div>
                <Error content={location.pathname} title="Invalid URL" />
            </div>
        );
    }
}

export default NotFound;
