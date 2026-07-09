import api from './axios';

// Resume CRUD API client calls
export const resumeApi = {
  create: async (resumeData) => {
    const response = await api.post('/resumes', resumeData);
    return response.data;
  },
  
  getAll: async () => {
    const response = await api.get('/resumes');
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/resumes/${id}`);
    return response.data;
  },
  
  update: async (id, resumeData) => {
    const response = await api.put(`/resumes/${id}`, resumeData);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/resumes/${id}`);
    return response.data;
  }
};

export default resumeApi;
