import { Dispatch } from "react-redux";
import { showLoading, hideLoading } from "react-redux-loading-bar";

interface ApiRequestData {
    path: string;
    body?: any;
    dispatch?: Dispatch;
    progressBarTarget?: string;
}

export interface ApiError {
    message: string;
}

export const apiRequest = ({ path, body, dispatch, progressBarTarget }: ApiRequestData) => {
    const host = process.env.REACT_APP_SERVER_HOST ? process.env.REACT_APP_SERVER_HOST : 'localhost:8081';
    return new Promise((resolve, reject) => {
        if (dispatch) {
            dispatch(showLoading(progressBarTarget ? progressBarTarget : undefined));
        }

        const timeout = setTimeout(() => {
            if (dispatch) {
                dispatch(hideLoading(progressBarTarget ? progressBarTarget : undefined));
            }
            reject(new Error('Request timed out'));
        }, 10000);

        fetch(`http://${host}/api/${path}`, body && {
            body: JSON.stringify(body),
            headers: { "Content-Type": "application/json" },
            method: "POST",
        }).then(async res => {
            clearTimeout(timeout);
            if (dispatch) {
                dispatch(hideLoading(progressBarTarget ? progressBarTarget : undefined));
            }
            if (res.status < 300) {
                resolve(await res.json());
            } else if (res.status < 500) {
                throw { message: await res.text() }
            } else {
                throw { message: res.statusText }
            }
        }).catch(err => {
            clearTimeout(timeout);
            if (dispatch) {
                dispatch(hideLoading(progressBarTarget ? progressBarTarget : undefined));
            }
            reject(err);
        });
    });
};
