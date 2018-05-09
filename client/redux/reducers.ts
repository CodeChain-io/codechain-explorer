import { ReduxAction } from "./actions";

export interface RootState {
    isNodeAlive: boolean | null;
}

const initialState: RootState = {
    isNodeAlive: null
};

export const rootReducer = (state: RootState = initialState, action: ReduxAction): RootState => {
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
