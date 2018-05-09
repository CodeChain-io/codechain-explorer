import { Dispatch } from "redux";

export interface IRootState {
    isNodeAlive: boolean | null;
}

const initialState = {
    isNodeAlive: null
} as IRootState;

type ActionType = "PING" | "ERROR";
type StateUpdate = Partial<IRootState>;

export const createApiDispatcher = (dispatch: Dispatch, apiName: string, type: ActionType, okReducer: (state: IRootState, json: ApiResponse) => StateUpdate) => {
    return () => {
        fetch(`http://localhost:8081/api/${apiName}`)
            .then(res => res.json())
            .then(json => {
                dispatch({
                    getUpdate: (state: IRootState) => okReducer(state, json),
                    type,
                });
            }).catch(err => {
                dispatch({
                    // FIXME:
                    getUpdate: (state: IRootState) => state,
                    type: "ERROR",
                });
            });
    };
}

type ApiResponse = PingResponse;
type PingResponse = string;

const pingReducer = (state: IRootState, json: PingResponse): StateUpdate => {
    return { isNodeAlive: json === "pong"};
};

export const getPingDispatcher = (dispatch: Dispatch) => createApiDispatcher(dispatch, "ping", "PING", pingReducer);

interface IReduxAction {
    type: ActionType;
    getUpdate: (state: IRootState) => StateUpdate;
}

export const rootReducer = (state = initialState, action: IReduxAction) => {
    return {
        ...state,
        ...action.getUpdate(state)
    };
};