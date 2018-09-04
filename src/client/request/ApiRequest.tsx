import { Dispatch } from "react-redux";
import { hideLoading, showLoading } from "react-redux-loading-bar";

interface ApiRequestData {
    path: string;
    body?: any;
    dispatch: Dispatch;
    showProgressBar: boolean;
    progressBarTarget?: string;
}

export interface ApiError {
    message: string;
}

export const apiRequest = ({ path, body, dispatch, progressBarTarget, showProgressBar }: ApiRequestData) => {
    const host = process.env.REACT_APP_SERVER_HOST ? process.env.REACT_APP_SERVER_HOST : "http://localhost:8081";
    return new Promise((resolve, reject) => {
        if (showProgressBar) {
            dispatch(showLoading(progressBarTarget ? progressBarTarget : undefined));
        }

        const timeout = setTimeout(() => {
            if (showProgressBar) {
                dispatch(hideLoading(progressBarTarget ? progressBarTarget : undefined));
            }
            reject(new Error("Request timed out"));
        }, 20000);

        fetch(
            `${host}/api/${path}`,
            body && {
                body: JSON.stringify(body),
                headers: { "Content-Type": "application/json" },
                method: "POST"
            }
        )
            .then(async res => {
                clearTimeout(timeout);
                if (dispatch) {
                    dispatch(hideLoading(progressBarTarget ? progressBarTarget : undefined));
                }
                if (res.status < 300) {
                    resolve(await res.json());
                } else if (res.status < 500) {
                    throw { message: await res.text() };
                } else {
                    throw { message: res.statusText };
                }
            })
            .catch(err => {
                clearTimeout(timeout);
                if (showProgressBar) {
                    dispatch(hideLoading(progressBarTarget ? progressBarTarget : undefined));
                }
                reject(err);
            });
    });
};
