import api from './axios';

// AI Integration API client calls
export const aiApi = {
  generate: async (resumeId) => {
    const response = await api.post('/ai/generate', { resumeId });
    return response.data;
  },

  analyze: async (resumeId) => {
    const response = await api.post('/ai/analyze', { resumeId });
    return response.data;
  },

  atsAnalyze: async (resumeId, jobDescription) => {
    const response = await api.post('/ai/ats-analyze', { resumeId, jobDescription });
    return response.data;
  }
};

export default aiApi;
