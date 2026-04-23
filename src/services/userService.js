import api from './api';

const userService = {
  getUserProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  updateUserProfile: async (userData) => {
    const response = await api.put('/users/profile', userData);
    return response.data;
  },

  updatePassword: async (passwordData) => {
    const response = await api.put('/users/password', passwordData);
    return response.data;
  },

  deleteAccount: async () => {
    const response = await api.delete('/users');
    return response.data;
  }
};

export default userService;
