
class Auth {
    constructor() {
        const accessToken = localStorage.getItem('accessToken');
        console.log(accessToken);
        this.validateAccessToken(accessToken);
    }

    async validateAccessToken(accessToken) {
        if (!accessToken) {
            this.redirectToLogin(); // Redirect if no access token
            return;
        }

        try {
            // Validate access token with a protected API route
            const response = await fetch('http://localhost:4000/auth/validate-token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
            });

            if (response.ok) {
                
                document.dispatchEvent(new Event('authInitialized'));
            } else if (response.status === 401) {
                // Token expired or invalid, attempt to refresh
                await this.refreshAccessToken();
            } else {
                throw new Error('Unexpected response during token validation.');
            }
        } catch (err) {
            console.error('Error validating access token:', err);
            this.redirectToLogin();
        }
    }

    async refreshAccessToken() {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
            this.redirectToLogin();
            return;
        }

        try {
            const response = await fetch('http://localhost:4000/auth/token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: refreshToken }),
            });

            if (response.ok) {
                const { accessToken } = await response.json();
                localStorage.setItem('accessToken', accessToken);
                await this.validateAccessToken(accessToken); // Retry validation with new token
            } else {
                console.error('Failed to refresh token:', await response.text());
                this.redirectToLogin();
            }
        } catch (err) {
            console.error('Error refreshing access token:', err);
            this.redirectToLogin();
        }
    }

    redirectToLogin() {
        console.error("Redirecting to login..."); // Log message before redirection
    setTimeout(() => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.replace("/");
    }, 10000); // 5-second delay before redirection
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
