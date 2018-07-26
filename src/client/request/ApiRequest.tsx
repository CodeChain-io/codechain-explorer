import { Dispatch } from "react-redux";
import { showLoading, hideLoading } from "react-redux-loading-bar";

interface ApiRequestData {
    path: string;
    body?: any;
    dispatch?: Dispatch;
}

export interface ApiError {
    message: string;
}

export const apiRequest = ({ path, body, dispatch }: ApiRequestData) => {
    const host = process.env.REACT_APP_SERVER_HOST ? process.env.REACT_APP_SERVER_HOST : 'localhost:8081';
    return new Promise((resolve, reject) => {
        if (dispatch) {
            dispatch(showLoading());
        }
        fetch(`http://${host}/api/${path}`, body && {
            body: JSON.stringify(body),
            headers: { "Content-Type": "application/json" },
            method: "POST",
        }).then(async res => {
            if (dispatch) {
                dispatch(hideLoading());
            }
            if (res.status < 300) {
                resolve(await res.json());
            } else if (res.status < 500) {
                throw { message: await res.text() }
            } else {
                throw { message: res.statusText }
            }
        }).catch(err => {
            if (dispatch) {
                dispatch(hideLoading());
            }
            reject(err);
        });
    });
};
