
export async function handleTokenRefreshAndRetry(url, options = {}) {
    const refreshToken = localStorage.getItem('refreshToken');
    console.log('Refresh token: ' + refreshToken);

    if (!refreshToken) {
        console.error('No refresh token found. Redirecting to login.');
        redirectToLogin();
        return null;
    }

    try {
        // Attempt to refresh the access token
        const response = await fetch('http://localhost:4000/auth/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: refreshToken }),
        });

        if (response.ok) {
            const { accessToken } = await response.json();

            // Update the access token in localStorage
            localStorage.setItem('accessToken', accessToken);

            // Ensure options and headers are defined
            const baseUrl = 'http://localhost:4000'; // Set default BASE_URL
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`, // Attach token automatically
                ...options.headers
            };
            // Retry the original fetch request with the new token
            let retryResponse = await fetch(`${baseUrl}${url}`, {headers, ...options });
            return retryResponse;
        } else {
            console.error('Failed to refresh token:', await response.text());
            redirectToLogin();
            return null;
        }
    } catch (error) {
        console.error('Error refreshing token:', error);
        redirectToLogin();
        return null;
    }
}

// Redirect to login page
function redirectToLogin() {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.replace("/");
}

export default handleTokenRefreshAndRetry;
