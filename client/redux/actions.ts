import { Dispatch } from "redux";

export interface RootState {
    isNodeAlive: boolean | null;
}

const initialState = {
    isNodeAlive: null
} as RootState;

type ActionType = "PING" | "ERROR";
type StateUpdate = Partial<RootState>;

export const createApiDispatcher = (dispatch: Dispatch, apiName: string, type: ActionType, okReducer: (state: RootState, json: ApiResponse) => StateUpdate) => {
    return () => {
        fetch(`http://localhost:8081/api/${apiName}`)
            .then(res => res.json())
            .then(json => {
                dispatch({
                    getUpdate: (state: RootState) => okReducer(state, json),
                    type,
                } as IReduxAction);
            }).catch(err => {
                dispatch({
                    // FIXME:
                    getUpdate: (state: RootState) => ({}),
                    type: "ERROR",
                } as IReduxAction);
            });
    };
}

type ApiResponse = PingResponse;
type PingResponse = string;

const pingReducer = (state: RootState, json: PingResponse): StateUpdate => {
    return { isNodeAlive: json === "pong" };
};

export const getPingDispatcher = (dispatch: Dispatch) => createApiDispatcher(dispatch, "ping", "PING", pingReducer);

interface IReduxAction {
    type: ActionType;
    getUpdate: (state: RootState) => StateUpdate;
}

export const rootReducer = (state = initialState, action: any) => {
    const update = action.getUpdate ? action.getUpdate(state) : {};
    return {
        ...state,
        ...update
    };
};
