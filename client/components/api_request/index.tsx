import * as React from "react";

import RequestBlockNumber from "./RequestBlockNumber";
import RequestBlockHash from "./RequestBlockHash";
import RequestBlock from "./RequestBlock";
import RequestParcel from "./RequestParcel";
import RequestAssetScheme from "./RequestAssetScheme";
import RequestAccount from "./RequestAccount";
import RequestPendingParcels from "./RequestPendingParcels";
import RequestTransactionInvoice from "./RequestTransactionInvoice";

import ApiDispatcher from "./ApiDispatcher";
import { RootState } from "../../redux/actions";

export { RequestParcel };
export { RequestBlockNumber };
export { RequestBlockHash };
export { RequestBlock };
export { RequestAssetScheme };
export { RequestAccount };
export { RequestPendingParcels };
export { RequestTransactionInvoice };

const pingReducer = (state: RootState, __: undefined, res: string) => {
    return { isNodeAlive: res === "pong" };
};
export const RequestPing = () => (
    <ApiDispatcher
        api={"ping"}
        reducer={pingReducer} />
);
