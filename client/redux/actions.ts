
type ActionType = "PING";
// FIXME: Annotate types;
type ActionPayload = any;

export type ReduxAction = {
    type: ActionType;
    payload: ActionPayload
}
export type ReduxDispatcher = () => ReduxAction;

// FIXME: hardcoded "pong"
export const ping: ReduxDispatcher = () => ({ type: "PING", payload: "pong" });
