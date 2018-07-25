import * as React from "react";
import { Form, FormGroup, Input, Button } from 'reactstrap';

import './Search.scss';

interface Props {
    className?: string
}

class Search extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
        this.state = {};
    }

    public render() {
        return <Form inline={true} className={`search-form ${this.props.className}`}>
            <FormGroup>
                <Input className="search-input" type="text" placeholder="Block / Parcel / Tx" />
                <Button className="search-summit" type="submit">Search</Button>
            </FormGroup>
        </Form>
    }
}

export default Search;
