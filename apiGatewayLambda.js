export const handler = async (event) => {
    let body;
    let statusCode = 200;
    const headers = {
        "Content-Type": "application/json",
    };
    const method = event.requestContext.http.method;
    const userAPI = "https://l2nvzdbutk.execute-api.ap-northeast-1.amazonaws.com/users";
    const resizeAPI = "https://l2nvzdbutk.execute-api.ap-northeast-1.amazonaws.com/resize";
    const updateUserAPI = "https://l2nvzdbutk.execute-api.ap-northeast-1.amazonaws.com/update-user";
    const changeStatus = "https://ndv1zmd80d.execute-api.ap-northeast-1.amazonaws.com/change-status"

    try {
        switch (event.routeKey) {
            case "ANY /free-call":
                switch (method) {
                    case "POST":
                        body = { message: "POST method called with free-call from 1.js" };
                        break;
                    case "GET":
                        body = { message: "GET method called with free-call from 1.js" };
                        break;
                    case "PUT":
                        body = { message: "PUT method called with free-call from 1.js" };
                        break;
                    case "DELETE":
                        body = { message: "DELETE method called with free-call from 1.js" };
                        break;
                    default:
                        throw new Error(`Unsupported method: "${method} for event ${JSON.stringify(event)}`);
                }
                break;
            case "ANY /company":
                switch (method) {
                    case "POST":
                        body = { message: "POST method called with company from 1.js" };
                        break;
                    case "GET":
                        // Call this userAPI
                        const response = await fetch(userAPI);
                        const data = await response.json();
                        body = { message: "GET method called with company from 1.js - data from rootAPI", data };
                        break;
                    case "PUT":
                        body = { message: "PUT method called with company from 1.js" };
                        break;
                    case "DELETE":
                        body = { message: "DELETE method called with company from 1.js" };
                        break;
                    default:
                        throw new Error(`Unsupported method: "${method2} for event ${JSON.stringify(event)}`);
                }
                break;
            case "ANY /change-status":
                //TODO: call api 
                default:
                throw new Error(`Unsupported route: "${event.routeKey} for event ${JSON.stringify(event)}`);
        }
    } catch (err) {
        statusCode = 400;
        body = err.message;
    } finally {
        body = JSON.stringify(body);
    }

    return {
        statusCode,
        body,
        headers,
    };
};
