import { hideLoading, showLoading } from "react-redux-loading-bar";

interface ApiRequestData {
    path: string;
    body?: any | null;
    dispatch: any;
    showProgressBar: boolean;
    progressBarTarget?: string;
}

export interface ApiError {
    message: string;
}

export const apiRequest = ({ path, body, dispatch, progressBarTarget, showProgressBar }: ApiRequestData) => {
    const host = process.env.REACT_APP_SERVER_HOST || "http://localhost:9001";

    const showLoadingBar = () => {
        if (showProgressBar) {
            dispatch(showLoading(progressBarTarget));
        }
    };

    const hideLoadingBar = () => {
        if (showProgressBar) {
            dispatch(hideLoading(progressBarTarget));
        }
    };

    return new Promise((resolve, reject) => {
        showLoadingBar();
        const timeout = setTimeout(() => {
            hideLoadingBar();
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
                hideLoadingBar();
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
                hideLoadingBar();
                reject(err);
            });
    });
};
