import * as React from "react";
import { Form, FormGroup, Input, Button } from 'reactstrap';

import './Search.scss';

interface State {
    status: string;
}

interface Props {
    className?: string
}

class Search extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            status: "wait"
        };
    }

    public render() {
        return <Form inline={true} onSubmit={this.handleSumbit} className={`search-form ${this.props.className}`}>
            <FormGroup className="mb-0">
                <Input className="search-input" type="text" placeholder="Block / Parcel / Tx / Asset / Address" />
            </FormGroup>
            <Button className="search-summit" type="submit">Search</Button>
        </Form>
    }

    private handleSumbit = (e: any) => {
        e.preventDefault();
        console.log("click")
    }
}

export default Search;
