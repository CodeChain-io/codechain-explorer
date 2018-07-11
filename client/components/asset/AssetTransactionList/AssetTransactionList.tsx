import * as React from "react";

import "./AssetTransactionList.scss"
import { Transaction } from "codechain-sdk/lib/core/classes";

interface OwnProps {
    transactionList: Transaction[]
}

const AssetTransactionList = (props: OwnProps) => {
    return <div>
        <h3>
            test
        </h3>
    </div>
};

export default AssetTransactionList;
