import axiosInstance from './axiosInstance';

export const getReport = async (start, end) => {
    const response = await axiosInstance.get('/reports', {
        params: { start, end },
    });
    return response.data;
};