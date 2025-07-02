// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://froms-5jow.onrender.com';

export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  REGISTER: `${API_BASE_URL}/api/auth/register`,
  USERS: `${API_BASE_URL}/api/auth/users`,
  USER_BY_ID: (id) => `${API_BASE_URL}/api/auth/users/${id}`,
  
  // Form endpoints
  FORMS: `${API_BASE_URL}/api/forms`,
  FORM_BY_ID: (id) => `${API_BASE_URL}/api/forms/${id}`,
  
  // Submission endpoints
  SUBMISSIONS: `${API_BASE_URL}/api/submissions`,
  SUBMISSIONS_BY_FORM: (formId) => `${API_BASE_URL}/api/submissions/form/${formId}`,
  USER_BY_ID_SUBMISSIONS: (userId) => `${API_BASE_URL}/api/submissions/user/${userId}`,
  FORM_RESPONSES: (formId) => `${API_BASE_URL}/api/forms/${formId}/responses`,
};

// Helper function to get auth headers
export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

export default API_BASE_URL;
