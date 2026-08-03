import axiosInstance from './axiosInstance';

export const startSession = async (type, plannedDurationMinutes) => {
    const response = await axiosInstance.post('/pomodoro/start', {
        type,
        plannedDurationMinutes,
    });
    return response.data;
};

export const endSession = async (id) => {
    const response = await axiosInstance.put(`/pomodoro/${id}/end`);
    return response.data;
};

export const getMySessions = async () => {
    const response = await axiosInstance.get('/pomodoro');
    return response.data;
};