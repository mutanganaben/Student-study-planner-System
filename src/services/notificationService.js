import api from './api';

const notificationService = {
  getSettings: async () => {
    const response = await api.get('/settings/notifications');
    return response.data;
  },

  updateSettings: async (settings) => {
    const response = await api.put('/settings/notifications', settings);
    return response.data;
  },

  getNotifications: async () => {
    const response = await api.get('/notifications');
    return response.data;
  },

  markAsRead: async (id) => {
    const response = await api.patch(`/notifications/${id}/read`);
    return response.data;
  }
};

export default notificationService;
