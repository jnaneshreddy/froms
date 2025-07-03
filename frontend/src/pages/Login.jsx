import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS, getAuthHeaders } from '../utils/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const response = await fetch(API_ENDPOINTS.LOGIN, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    console.log('Response Status:', response.status); 
    console.log('Response Data:', data); 

    if (response.ok) {
      localStorage.setItem('token', data.token); 
      localStorage.setItem('user', JSON.stringify(data.user)); 
      const userRole = data.user?.role; 
      console.log('User Role:', userRole); 

      if (userRole === 'admin') {
        console.log('Navigating to Admin Dashboard');
        navigate('/admin'); 
      } else if (userRole === 'user') {
        console.log('Navigating to User Dashboard');
        navigate('/user'); 
      } else {
        console.error('Invalid user role received:', userRole);
        setError('Invalid user role. Please contact support.');
      }
    } else {
      setError(data.message || 'Invalid login credentials');
    }
  } catch (err) {
    console.error('Login Error:', err);
    setError('An error occurred. Please try again.');
  }
};


  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form className="bg-white p-6 rounded shadow-md w-80" onSubmit={handleLogin}>
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Enter your password"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
