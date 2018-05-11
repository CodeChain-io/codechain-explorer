export interface RootState {
    isNodeAlive?: boolean;
    bestBlockNumber?: number;
    blocksByNumber: {
        [n: number]: any;
    };
    blocksByHash: {
        [hash: string]: any;
    };
    blockHashesByNumber: {
        [n: number]: string;
    };
    transactionsByHash: {
        [hash: string]: any;
    };
}

const initialState = {
    isNodeAlive: undefined,
    bestBlockNumber: undefined,
    blocksByNumber: {},
    blocksByHash: {},
    blockHashesByNumber: {},
    transactionsByHash: {},
} as RootState;

export const rootReducer = (state = initialState, action: any) => {
    const update = action.getUpdate ? action.getUpdate(state) : {};
    return {
        ...state,
        ...update
    };
};
