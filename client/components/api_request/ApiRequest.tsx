interface ApiRequestData {
    port?: number;
    path: string;
    body?: any;
}

export interface ApiError {
    message: string;
}

export const apiRequest = ({ port = 8081, path, body }: ApiRequestData) => {
    return new Promise((resolve, reject) => {
        fetch(`http://localhost:${port}/api/${path}`, body && {
            body: JSON.stringify(body),
            headers: { "Content-Type": "application/json" },
            method: "POST",
        }).then(async res => {
            if (res.status < 300) {
                resolve(await res.json());
            } else if (res.status < 500) {
                throw { message: await res.text() }
            } else {
                throw { message: res.statusText }
            }
        }).catch(err => {
            reject(err);
        });
    });
};
