import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api/v1',
    withCredentials: true, // Important for cookies (refresh tokens)
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Attach Token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor: Handle Errors (e.g., 401)
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        // Optional: Handle token refresh logic here if needed automatically
        // For now, we just pass the error to the component
        return Promise.reject(error);
    }
);

export default api;
