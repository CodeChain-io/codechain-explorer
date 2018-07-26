import { createStore } from "redux";
import { rootReducer } from "./actions";

export const store = createStore(rootReducer);
