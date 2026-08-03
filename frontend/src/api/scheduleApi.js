import axiosInstance from './axiosInstance';

export const createSchedule = async (scheduleData) => {
    const response = await axiosInstance.post('/schedules', scheduleData);
    return response.data;
};

export const getMySchedules = async () => {
    const response = await axiosInstance.get('/schedules');
    return response.data;
};

export const updateSchedule = async (id, scheduleData) => {
    const response = await axiosInstance.put(`/schedules/${id}`, scheduleData);
    return response.data;
};

export const deleteSchedule = async (id) => {
    const response = await axiosInstance.delete(`/schedules/${id}`);
    return response.data;
};