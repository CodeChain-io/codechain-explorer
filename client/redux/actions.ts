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
            .then(res => res.text())
            .then(json => {
                dispatch({
                    getUpdate: (state: IRootState) => okReducer(state, json),
                    type,
                } as IReduxAction);
            }).catch(err => {
                dispatch({
                    // FIXME:
                    getUpdate: (state: IRootState) => ({}),
                    type: "ERROR",
                } as IReduxAction);
            });
    };
}

type ApiResponse = PingResponse;
type PingResponse = string;

const pingReducer = (state: IRootState, json: PingResponse): StateUpdate => {
    return { isNodeAlive: json === "pong" };
};

export const getPingDispatcher = (dispatch: Dispatch) => createApiDispatcher(dispatch, "ping", "PING", pingReducer);

interface IReduxAction {
    type: ActionType;
    getUpdate: (state: IRootState) => StateUpdate;
}

export const rootReducer = (state = initialState, action: any) => {
    const update = action.getUpdate ? action.getUpdate(state) : {};
    return {
        ...state,
        ...update
    };
};
