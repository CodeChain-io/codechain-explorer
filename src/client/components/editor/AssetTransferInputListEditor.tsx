import * as _ from "lodash";
import * as React from "react";

import AssetTransferInputEditor from "./AssetTransferInputEditor";

interface Props {
    // FIXME: any
    onChange: (inputs: any[]) => void;
}

interface State {
    n: number;
}

export default class AssetTransferInputListEditor extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { n: 0 };
    }
    public render() {
        const { n } = this.state;
        return (
            <div>
                <button onClick={this.onAdd}>Add</button>
                {_.range(0, n).map(i => (
                    <div key={`asset-transfer-input-list-${i}`}>
                        Input {i} <button onClick={this.onClickRemove(i)}>Remove</button>
                        <br />
                        <AssetTransferInputEditor onChange={this.onChangeInput(i)} />
                        <br />
                    </div>
                ))}
            </div>
        );
    }

    private onAdd = () => {
        this.setState({
            n: this.state.n + 1
        });
    };

    private onChangeInput = (i: number) => {
        // FIXME: any
        return (input: any) => {
            alert("Not implemented");
        };
    };

    private onClickRemove = (i: number) => {
        return () => {
            alert("Not implemented");
        };
    };
}
