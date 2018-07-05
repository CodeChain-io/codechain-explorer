import * as React from "react";
import { Form, FormGroup, Input, Button } from 'reactstrap';

import './Search.scss';

class Search extends React.Component<{}> {
    constructor(props: {}) {
        super(props);
        this.state = {};
    }

    public render() {
        return <div>
            <Form inline={true}>
                <FormGroup>
                    <Input className="search-input" type="text" placeholder="Block / Parcel / Tx" />
                    <Button type="submit">Search</Button>
                </FormGroup>
            </Form>
        </div>
    }
}

export default Search;
