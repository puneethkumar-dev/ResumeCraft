import api from './axios';

// AI Integration API client calls
export const aiApi = {
  generate: async (resumeId) => {
    const response = await api.post('/ai/generate', { resumeId });
    return response.data;
  }
};

export default aiApi;
