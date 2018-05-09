
type ActionType = "PING";
// FIXME: Annotate types;
type ActionPayload = any;

export interface IReduxAction {
    type: ActionType;
    payload: ActionPayload
}
export type ReduxDispatcher = () => IReduxAction;

// FIXME: hardcoded "pong"
export const ping: ReduxDispatcher = () => ({ type: "PING", payload: "pong" });
