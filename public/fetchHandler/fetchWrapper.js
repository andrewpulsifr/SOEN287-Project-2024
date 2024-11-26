// api/utils/fetchWrapper.js
import handleTokenRefreshAndRetry from "./tokenHandler.js"

export async function fetchWrapper(url, options = {}, accessToken) {
    const baseUrl = 'http://localhost:4000'; // Set default BASE_URL
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`, // Attach token automatically
        ...options.headers
    };
    let response = await fetch(`${baseUrl}${url}`, {headers, ...options });

    // If the response indicates an unauthorized error (401), attempt to refresh the token
    if (response.status === 401) {
        const refreshedResponse = await handleTokenRefreshAndRetry(url, options); // Pass url and options only
        
        if (!refreshedResponse.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
    }
    return response; // Return the full response object
}

export default fetchWrapper;

