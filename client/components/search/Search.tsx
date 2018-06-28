import * as React from "react";
import { Form, FormGroup, FormControl, Button } from 'react-bootstrap';

class Search extends React.Component<{}> {
    constructor(props: {}) {
        super(props);
        this.state = {};
    }

    public render() {
        return <div>
            <Form inline={true}>
                <FormGroup controlId="formInlineEmail">
                    <FormControl type="email" placeholder="Block / Parcel / Tx" />
                </FormGroup>{' '}
                <Button type="submit">Search</Button>
            </Form>
        </div>
    }
}

export default Search;
