import { createStore, applyMiddleware } from "redux";
import { loadingBarMiddleware } from 'react-redux-loading-bar'
import { rootReducer } from "./actions";

export const store = createStore(rootReducer,
    applyMiddleware(
        loadingBarMiddleware({
            scope: 'searchBar',
        })
    )
);
