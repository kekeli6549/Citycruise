import apiClient from './apiClient';

export const sendEnquiry = async (email, fullname, message) => {
    const response = await apiClient.post('/send-enquiry', { email, fullname, message });
    return response.data;
};
