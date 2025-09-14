import axios from '../utils/axios';

export const getCompanyAssessments = async () => {
  const response = await axios.get('/assessment');
  return response.data || [];
};

export const getLatestCompanyAssessment = async () => {
  const response = await axios.get('/assessment/latest');
  return response.data;
};

export const getAssessmentSummary = async (id: number) => {
  const response = await axios.get(`/assessment/${id}/summary`);
  return response.data;
};

export const getAssessmentWithEmissions = async (id: number) => {
  const response = await axios.get(`/assessment/${id}`);
  return response.data;
};

export const createAssessment = async (data: any) => {
  const response = await axios.post('/assessment', data);
  return response.data;
};

export const updateAssessment = async (id: number, data: any) => {
  const response = await axios.patch(`/assessment/${id}`, data);
  return response.data;
};

export const createEmission = async (assessmentId: string, emission: any) => {
  // On suppose que l'API attend assessmentId dans le body de l'émission
  const response = await axios.post('/emissions', { ...emission, assessment: `/assessment/${assessmentId}` });
  return response.data;
};

export const updateEmission = async (emissionId: number, emission: any) => {
  const response = await axios.patch(`/emissions/${emissionId}`, emission);
  return response.data;
};

export const deleteEmission = async (emissionId: number) => {
  const response = await axios.delete(`/emissions/${emissionId}`);
  return response.data;
};

export const getEmission = async (emissionId: number) => {
  const response = await axios.get(`/emissions/${emissionId}`);
  return response.data;
};
