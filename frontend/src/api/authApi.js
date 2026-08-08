import axiosInstance from './axiosInstance';

export const registerUser = async (name, email, password) => {
    const response = await axiosInstance.post('/auth/register', {
        name,
        email,
        password,
    });
    return response.data;
};

export const loginUser = async (email, password) => {
    const response = await axiosInstance.post('/auth/login', {
        email,
        password,
    });
    return response.data;
};

export const forgotPassword = async (email) => {
    const response = await axiosInstance.post('/auth/forgot-password', { email });
    return response.data;
};

export const resetPassword = async (token, newPassword) => {
    const response = await axiosInstance.post('/auth/reset-password', { token, newPassword });
    return response.data;
};

export const verifyEmail = async (token) => {
    const response = await axiosInstance.get(`/auth/verify-email?token=${token}`);
    return response.data;
};
