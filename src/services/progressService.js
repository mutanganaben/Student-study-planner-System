import api from './api';

const progressService = {
  getStats: async () => {
    const response = await api.get('/progress/stats');
    return response.data;
  },

  getWeeklyData: async () => {
    const response = await api.get('/progress/weekly');
    return response.data;
  },

  getCourseData: async () => {
    const response = await api.get('/progress/courses');
    return response.data;
  },

  getRecommendations: async () => {
    const response = await api.get('/progress/recommendations');
    return response.data;
  },

  getGoals: async () => {
    const response = await api.get('/progress/goals');
    return response.data;
  }
};

export default progressService;
