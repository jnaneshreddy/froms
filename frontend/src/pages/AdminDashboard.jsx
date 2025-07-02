import React, { useState, useEffect, useCallback } from 'react';
import FormBuilder from '../components/FormBuilder';
import Navbar from '../components/Navbar';
import { API_ENDPOINTS, getAuthHeaders } from '../utils/api';

const AdminDashboard = () => {
  const [forms, setForms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedForm, setSelectedForm] = useState(null);
  const [responses, setResponses] = useState([]);
  const [selectedTab, setSelectedTab] = useState('forms'); // New state for tab selection
  const [users, setUsers] = useState([]);
  const [isUsersLoading, setIsUsersLoading] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user'
  });
  const [currentUser, setCurrentUser] = useState(null);

  // Get current user from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setCurrentUser(user);
  }, []);

  // Fetch existing forms when component mounts
  const fetchForms = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.FORMS, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        const existingForms = await response.json();
        setForms(existingForms);
      } else {
        console.error('Error fetching forms:', await response.text());
      }
    } catch (err) {
      console.error('Error fetching forms:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch user data
  const fetchUserData = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.USER_BY_ID_SUBMISSIONS(userId), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        return userData.email; // Return only the email
      } else {
        console.error('Error fetching user data:', await response.text());
        return "Email not found"; // Return fallback value
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
      return "Email not found"; // Return fallback value
    }
  };

  // Fetch responses for a form
  const fetchResponses = useCallback(async (formId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.SUBMISSIONS_BY_FORM(formId), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Submissions data:', data); // Debug log
        const form = forms.find((f) => f._id === formId);

        if (form && data.length > 0) {
          const mappedResponses = await Promise.all(
            data.map(async (submission) => {
              // Ensure userId is a string, not an object
              const userId = typeof submission.userId === 'object' ? submission.userId._id || submission.userId.toString() : submission.userId;
              console.log('Processing userId:', userId); // Debug log
              
              const userEmail = await fetchUserData(userId); // Fetch email directly
              
              // Safely handle submission.responses
              const responses = submission.responses || {};
              const mappedFields = Object.entries(responses).reduce((acc, [fieldId, answer]) => {
                const field = form.fields.find((f) => f._id === fieldId);
                acc[field ? field.label : fieldId] = answer;
                return acc;
              }, {});

              return {
                userEmail, // Use fetched email
                responses: mappedFields,
              };
            })
          );

          setResponses(mappedResponses);
        } else {
          console.log('No form found or no submissions');
          setResponses([]);
        }
      } else {
        console.error('Error fetching responses:', await response.text());
      }
    } catch (err) {
      console.error('Error fetching responses:', err);
    }
  }, [forms]);

  // Fetch all users
  const fetchUsers = useCallback(async () => {
    setIsUsersLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.USERS, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const usersData = await response.json();
        setUsers(usersData);
      } else {
        console.error('Error fetching users:', await response.text());
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setIsUsersLoading(false);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchForms();
  }, []);

  // Handle tab changes
  useEffect(() => {
    if (selectedTab === 'responses' && selectedForm) {
      fetchResponses(selectedForm._id);
    } else if (selectedTab === 'users') {
      fetchUsers();
    }
  }, [selectedTab, selectedForm, fetchResponses, fetchUsers]);

  // Callback when a form is updated
  const handleFormUpdated = (updatedForm) => {
    setForms((prevForms) => {
      const updatedForms = prevForms.map((form) => (form._id === updatedForm._id ? updatedForm : form));
      return updatedForms;
    });

    setSelectedForm(updatedForm); // Ensure the updated form is selected

    // Send updated form to the backend to ensure user-side updates
    const updateFormOnServer = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(API_ENDPOINTS.FORM_BY_ID(updatedForm._id), {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedForm),
        });

        if (response.ok) {
          fetchResponses(updatedForm._id); // Refetch responses for the updated form
        } else {
          console.error('Error updating form on server:', await response.text());
        }
      } catch (err) {
        console.error('Error updating form on server:', err);
      }
    };

    updateFormOnServer();
  };

  // Delete form
  const deleteForm = async (formId) => {
    if (!window.confirm('Are you sure you want to delete this form?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.FORM_BY_ID(formId), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setForms(forms.filter((form) => form._id !== formId));
        alert('Form deleted successfully!');
      } else {
        console.error('Error deleting form:', await response.text());
        alert('Error deleting form');
      }
    } catch (err) {
      console.error('Error deleting form:', err);
      alert('Error deleting form');
    }
  };

  // Add new user
  const addUser = async (e) => {
    e.preventDefault();
    
    if (!newUser.name || !newUser.email || !newUser.password) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.REGISTER, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        const userData = await response.json();
        setUsers([...users, userData.user]);
        setNewUser({ name: '', email: '', password: '', role: 'user' });
        alert('User added successfully!');
      } else {
        const errorData = await response.json();
        alert(`Error adding user: ${errorData.message}`);
      }
    } catch (err) {
      console.error('Error adding user:', err);
      alert('Error adding user');
    }
  };

  // Delete user
  const deleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.USER_BY_ID(userId), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setUsers(users.filter((user) => user._id !== userId));
        alert('User deleted successfully!');
      } else {
        console.error('Error deleting user:', await response.text());
        alert('Error deleting user');
      }
    } catch (err) {
      console.error('Error deleting user:', err);
      alert('Error deleting user');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar user={currentUser} />
      
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Create, edit, and manage your forms</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs Section */}
        <div className="mb-6">
          <ul className="flex border-b">
            <li
              className={`cursor-pointer px-4 py-2 ${selectedTab === 'forms' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
              onClick={() => setSelectedTab('forms')}
            >
              Forms
            </li>
            <li
              className={`cursor-pointer px-4 py-2 ${selectedTab === 'responses' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
              onClick={() => setSelectedTab('responses')}
            >
              Responses
            </li>
            <li
              className={`cursor-pointer px-4 py-2 ${selectedTab === 'users' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
              onClick={() => setSelectedTab('users')}
            >
              Users
            </li>
          </ul>
        </div>

        {/* Forms Section */}
        {selectedTab === 'forms' && (
          <div className="mb-12">
            <FormBuilder
              onSave={handleFormUpdated}
              formToEdit={selectedForm} // Pass selected form for editing
            />

            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4">
                <h2 className="text-2xl font-bold text-white">Your Forms</h2>
                <p className="text-purple-100">Manage your created forms</p>
              </div>

              <div className="p-6">
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="text-gray-400 text-2xl mb-4">⏳</div>
                    <p className="text-gray-500">Loading forms...</p>
                  </div>
                ) : forms.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-400 text-4xl mb-4">📝</div>
                    <p className="text-gray-500 text-lg">No forms created yet</p>
                    <p className="text-gray-400 text-sm">Create your first form above</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {forms.map((form) => (
                      <div
                        key={form._id}
                        className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow duration-200 cursor-pointer"
                        onClick={() => {
                          setSelectedForm(form);
                          fetchResponses(form._id);
                        }}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">{form.title}</h3>
                          <button
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent triggering edit
                              deleteForm(form._id);
                            }}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors duration-200"
                            title="Delete form"
                          >
                            🗑️
                          </button>
                        </div>
                        {form.description && (
                          <p className="text-gray-600 text-sm mb-4 line-clamp-3">{form.description}</p>
                        )}
                        <div className="flex justify-between items-center text-sm text-gray-500">
                          <span>{form.fields?.length || 0} fields</span>
                          <span>{new Date(form.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Responses Section */}
        {selectedTab === 'responses' && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-teal-600 px-6 py-4">
              <h2 className="text-2xl font-bold text-white">Responses</h2>
              <p className="text-green-100">View user responses for the selected form</p>
            </div>

            <div className="p-6">
              {responses.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-4xl mb-4">📋</div>
                  <p className="text-gray-500 text-lg">No responses yet</p>
                  <p className="text-gray-400 text-sm">
                    {selectedForm ? 'No one has submitted this form yet' : 'Select a form to view responses'}
                  </p>
                </div>
              ) : (
                responses.map((response, index) => (
                  <div key={index} className="bg-gray-50 rounded-xl p-4 border border-gray-200 mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">User: {response.userEmail}</h3>
                    <ul className="list-disc pl-6">
                      {Object.entries(response.responses).map(([fieldLabel, answer]) => (
                        <li key={fieldLabel} className="text-gray-600">
                          <strong>{fieldLabel}:</strong> {answer}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Users Section */}
        {selectedTab === 'users' && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-red-600 to-pink-600 px-6 py-4">
              <h2 className="text-2xl font-bold text-white">User Management</h2>
              <p className="text-red-100">Manage app users and their roles</p>
            </div>

            <div className="p-6">
              {/* New User Form */}
              <form
                onSubmit={addUser}
                className="bg-gray-50 p-4 rounded-lg shadow-md mb-6"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Create New User</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={newUser.name}
                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                      required
                      className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:border-blue-500 p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      required
                      className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:border-blue-500 p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input
                      type="password"
                      value={newUser.password}
                      onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                      required
                      className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:border-blue-500 p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <select
                      value={newUser.role}
                      onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                      className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:border-blue-500 p-2"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>
                <div className="mt-4">
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white font-semibold rounded-md shadow-md py-2 hover:bg-blue-700 transition-colors duration-200"
                  >
                    Create User
                  </button>
                </div>
              </form>

              {/* Users List */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Existing Users</h3>
                {isUsersLoading ? (
                  <div className="text-center py-8">
                    <div className="text-gray-400 text-2xl mb-4">⏳</div>
                    <p className="text-gray-500">Loading users...</p>
                  </div>
                ) : users.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-400 text-4xl mb-4">👥</div>
                    <p className="text-gray-500 text-lg">No users found</p>
                    <p className="text-gray-400 text-sm">Create new users using the form above</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {users.map((user) => (
                      <div
                        key={user._id}
                        className="bg-gray-50 rounded-xl p-6 border border-gray-200"
                      >
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="text-lg font-semibold text-gray-800">{user.name}</h4>
                          <span className={`text-xs font-semibold rounded-full px-3 py-1 ${user.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-2">Email: {user.email}</p>
                        <div className="flex space-x-2">
                          <button
                            className="flex-1 bg-blue-600 text-white rounded-md shadow-md py-2 text-sm font-semibold hover:bg-blue-700 transition-colors duration-200"
                            onClick={() => {}}
                          >
                            Edit
                          </button>
                          <button
                            className="flex-1 bg-red-600 text-white rounded-md shadow-md py-2 text-sm font-semibold hover:bg-red-700 transition-colors duration-200"
                            onClick={() => deleteUser(user._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
