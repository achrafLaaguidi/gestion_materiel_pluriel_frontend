export async function MakeRequest(url, method, data = null) {
    const options = {
        method: method,
        headers: {
            "Content-Type": "application/json"
        }
    };

    if (data) {
        options.body = JSON.stringify(data);
    }


    const response = await fetch(url, options);
    if (!response.ok) {
        return await response.json().then(errorData => {
            throw new Error(errorData.message);
        });
    }
    return await response.json();

}


