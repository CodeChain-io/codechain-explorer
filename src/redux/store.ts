import { loadingBarMiddleware } from "react-redux-loading-bar";
import { applyMiddleware, createStore } from "redux";
import { rootReducer } from "./actions";

export const store = createStore(
    rootReducer,
    applyMiddleware(
        loadingBarMiddleware({
            scope: "searchBar"
        })
    )
);
