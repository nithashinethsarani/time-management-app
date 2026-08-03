import axiosInstance from './axiosInstance';

export const getCurrentUser = async () => {
    const response = await axiosInstance.get('/users/me');
    return response.data;
};

export const updateProfile = async (name, email) => {
    const response = await axiosInstance.put('/users/me', { name, email });
    return response.data;
};

export const changePassword = async (currentPassword, newPassword) => {
    const response = await axiosInstance.put('/users/me/password', { currentPassword, newPassword });
    return response.data;
};