import fetchWrapper from "../fetchHandler/fetchWrapper.js";

export class Auth {
    constructor() {
        const accessToken = localStorage.getItem('accessToken');
        this.validateAccessToken(accessToken);
    }

    async validateAccessToken(accessToken) {
        if (!accessToken) {
            console.error('No access token found. Redirecting to login.');
            this.redirectToLogin(); // Redirect if no access token
            return;
        }

        try {
            // Validate access token with a protected API route
            const url = '/validate-token'; // The endpoint you want to call
            const options = {
                method: 'POST', // HTTP method for the request
            };
        
            const response = await fetchWrapper(url, options, accessToken); // Call the wrapper
            if (response.ok) {
                
                document.dispatchEvent(new Event('authInitialized'));
            } else {
                throw new Error('Unexpected response during token validation.'+ response.message);
            }
        } catch (err) {
            console.error('Error validating access token:', err);
        }
    }

    redirectToLogin() {
        console.error("Redirecting to login..."); // Log message before redirection
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.replace("/");
    }

    logout() {
        const refreshToken = localStorage.getItem('refreshToken');

        if (refreshToken) {
            // Invalidate refresh token on server
            fetch('/auth/logout', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: refreshToken }),
            }).catch(err => console.error('Error during logout:', err));
        }

        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.replace("client-login.html");
    }

    async deleteAccount() {
        const userId = localStorage.getItem('userId'); // Get user ID from localStorage
        try {
            const response = await fetch(`/users/${userId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.ok) {
                this.logout(); // Log out after account deletion
            } else {
                console.error('Failed to delete account:', await response.text());
            }
        } catch (err) {
            console.error('Error deleting account:', err);
        }
    }
}

export default Auth;