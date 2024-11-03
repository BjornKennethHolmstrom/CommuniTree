import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const AuthContext = createContext();

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const AuthProvider = ({ children }) => {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');
    if (token && refreshToken) {
      api.defaults.headers.common['x-auth-token'] = token;
      setUser({ token, refreshToken });
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const { accessToken, refreshToken, user: userData } = res.data;
      localStorage.setItem('token', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      api.defaults.headers.common['x-auth-token'] = accessToken;
      setUser({ ...userData, token: accessToken, refreshToken });
    } catch (error) {
      console.error(t('authContext.loginError'), error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    api.defaults.headers.common['x-auth-token'] = '';
    setUser(null);
  };

  const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      const res = await api.post('/auth/refresh-token', { refreshToken });
      const { accessToken: newAccessToken, refreshToken: newRefreshToken } = res.data;
      localStorage.setItem('token', newAccessToken);
      localStorage.setItem('refreshToken', newRefreshToken);
      api.defaults.headers.common['x-auth-token'] = newAccessToken;
      setUser(prevUser => ({ ...prevUser, token: newAccessToken, refreshToken: newRefreshToken }));
      return newAccessToken;
    } catch (error) {
      console.error(t('authContext.tokenRefreshError'), error);
      logout();
      throw error;
    }
  };

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const newToken = await refreshToken();
          originalRequest.headers['x-auth-token'] = newToken;
          return api(originalRequest);
        } catch (refreshError) {
          logout();
          alert(t('authContext.sessionExpired'));
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );

  return (
    <AuthContext.Provider value={{ user, login, logout, refreshToken, loading, api }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export { api };
