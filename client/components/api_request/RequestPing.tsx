import * as React from "react";

import { apiRequest, ApiError } from "./ApiRequest";

interface OwnProps {
    onPong: () => void;
    onError: (e: ApiError) => void;
}

class RequestPing extends React.Component<OwnProps> {
    public componentWillMount() {
        const { onPong, onError } = this.props;
        apiRequest({ path: `ping` }).then((response: string) => {
            if (response === "pong") {
                onPong();
            } else {
                onError({ message: `Expected 'pong' but '${response}'` });
            }
        }).catch(onError);
    }

    public render() {
        return (null);
    }
}

export default RequestPing;
