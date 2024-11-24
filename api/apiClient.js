import axios from 'axios';

// Create an instance of axios
const apiClient = axios.create({
    baseURL: 'http://localhost:4000', // Replace with your API base URL
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to automatically include the access token
apiClient.interceptors.request.use((config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
}, (error) => Promise.reject(error));

// Add a response interceptor to handle token expiry
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            try {
                const refreshToken = localStorage.getItem('refreshToken');
                if (!refreshToken) throw new Error('No refresh token available. Please log in again.');

                const { data } = await axios.post('http://localhost:4000/auth/token', { token: refreshToken });

                const { accessToken } = data;
                // Save the new access token
                localStorage.setItem('accessToken', accessToken);

                // Retry the original request with the new token
                error.config.headers['Authorization'] = `Bearer ${accessToken}`;
                return apiClient.request(error.config);
            } catch (refreshError) {
                console.error('Token refresh failed:', refreshError);
                localStorage.clear(); // Clear tokens and force re-login
                window.location.href = 'login.html'; // Redirect to login page
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;