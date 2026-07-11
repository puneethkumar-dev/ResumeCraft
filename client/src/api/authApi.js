import api from './axios';

// Auth API client calls
export const authApi = {
  register: async (name, email, password) => {
    const response = await api.post('/auth/register', { name, email, password });
    return response.data;
  },
  
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },
  
  updateProfile: async (name, email) => {
    const response = await api.put('/auth/profile', { name, email });
    return response.data;
  },
  
  updatePassword: async (currentPassword, newPassword) => {
    const response = await api.put('/auth/password', { currentPassword, newPassword });
    return response.data;
  }
};

export default authApi;
