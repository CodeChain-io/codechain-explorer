import { IReduxAction } from "./actions";

export interface IRootState {
    isNodeAlive: boolean | null;
}

const initialState: IRootState = {
    isNodeAlive: null
};

export const rootReducer = (state = initialState, action: IReduxAction): IRootState => {
    switch (action.type) {
        case "PING":
            return {
                ...state,
                isNodeAlive: action.payload === "pong"
            };
        default:
            return state;
    }
};
