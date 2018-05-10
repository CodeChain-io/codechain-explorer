export interface RootState {
    isNodeAlive?: boolean;
    bestBlockNumber?: number;
}

const initialState = {
    isNodeAlive: undefined,
    bestBlockNumber: undefined,
} as RootState;

export const rootReducer = (state = initialState, action: any) => {
    const update = action.getUpdate ? action.getUpdate(state) : {};
    return {
        ...state,
        ...update
    };
};
