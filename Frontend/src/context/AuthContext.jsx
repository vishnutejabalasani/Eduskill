import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in on mount
        const checkLoggedIn = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    // Verify token validity by fetching user profile (endpoint not made yet, but effectively we trust token for now until 401)
                    // Ideally: const res = await api.get('/auth/me'); setUser(res.data.data.user);
                    // For now, we decoding or just assuming valid until API call fails
                    // Let's implement a 'me' endpoint later. For MVP, we persist user data in local storage or just token.
                    const savedUser = localStorage.getItem('user');
                    if (savedUser) setUser(JSON.parse(savedUser));
                } catch (error) {
                    logout();
                }
            }
            setLoading(false);
        };
        checkLoggedIn();
    }, []);

    const login = async (email, password) => {
        const res = await api.post('/auth/login', { email, password });
        const { token, data } = res.data;

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(data.user));

        setUser(data.user);
        return data.user;
    };

    const signup = async (userData) => {
        const res = await api.post('/auth/signup', userData);
        const { token, data } = res.data;

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(data.user));

        setUser(data.user);
        return data.user;
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        // api.post('/auth/logout'); // Optional: Call backend to clear httpOnly cookie
    };

    const updateUser = (userData) => {
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    }

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, updateUser, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
