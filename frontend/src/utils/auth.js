export const getToken = () => localStorage.getItem('token');

export const decodeToken = (token) => {
  if (!token) return null;
  try {
    return JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
  } catch (err) {
    console.error('Invalid token:', err);
    return null;
  }
};

export const getRoleFromToken = () => {
  const token = getToken();
  const payload = decodeToken(token);
  return payload?.role || null; // Return the role or null if not present
};
