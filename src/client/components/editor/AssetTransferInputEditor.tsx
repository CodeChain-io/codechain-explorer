import * as React from "react";

interface Props {
    // FIXME: any
    onChange: (input: any) => void;
}

interface State {
    txhash: string;
    txIndex: number;
    assetType: string;
    // FIXME: U64
    amount: number;
    lockScript: string;
    unlockScript: string;
}

export default class AssetTransferInputEditor extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            txhash: "0000000000000000000000000000000000000000000000000000000000000000",
            txIndex: 0,
            assetType: "0000000000000000000000000000000000000000000000000000000000000000",
            amount: 0,
            lockScript: "0x0201",
            unlockScript: "0x"
        };
    }

    public render() {
        const { txhash, txIndex, assetType, amount, lockScript, unlockScript } = this.state;
        return (
            <div>
                <div>
                    <span>Transaction Hash</span>
                    <input onChange={this.onChangeTxhash} value={txhash} />
                    <br />
                    <span>Transaction Index</span>
                    <input onChange={this.onChangeTxIndex} value={txIndex} />
                    <br />
                    <span>Asset Type</span>
                    <input onChange={this.onChangeAssetType} value={assetType} />
                    <br />
                    <span>Amount</span>
                    <input onChange={this.onChangeAmount} value={amount} />
                </div>
                <span>Lock Script</span>
                <input onChange={this.onChangeLockScript} value={lockScript} />
                <br />
                <span>Unlock Script</span>
                <input onChange={this.onChangeUnlockScript} value={unlockScript} />
                <br />
            </div>
        );
    }

    private onChangeTxhash = (event: React.ChangeEvent<HTMLInputElement>) => {
        // FIXME: check event.target.string has 64 length or 66 length with "0x" prefix
        this.setState({
            ...this.state,
            txhash: event.target.value
        });
    };

    private onChangeTxIndex = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            ...this.state,
            txIndex: Number.parseInt(event.target.value)
        });
    };

    private onChangeAssetType = (event: React.ChangeEvent<HTMLInputElement>) => {
        // FIXME: check event.target.string has 64 length or 66 length with "0x" prefix
        this.setState({
            ...this.state,
            assetType: event.target.value
        });
    };

    private onChangeAmount = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            ...this.state,
            amount: Number.parseInt(event.target.value)
        });
    };

    private onChangeLockScript = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            ...this.state,
            lockScript: event.target.value
        });
    };

    private onChangeUnlockScript = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            ...this.state,
            unlockScript: event.target.value
        });
    };
}
