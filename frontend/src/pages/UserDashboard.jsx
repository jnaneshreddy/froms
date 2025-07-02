import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import FormField from '../components/FormField';
import { API_ENDPOINTS, getAuthHeaders } from '../utils/api';

const UserDashboard = () => {
  const [forms, setForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);
  const [responses, setResponses] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedForms, setSubmittedForms] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  // Get current user from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setCurrentUser(user);
  }, []);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          alert('You must be logged in to view forms.');
          return;
        }

        const response = await fetch(API_ENDPOINTS.FORMS, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();
        setForms(data);
      } catch (error) {
        console.error('Error fetching forms:', error);
      }
    };

    fetchForms();
  }, []);

  const handleResponseChange = (fieldId, value) => {
    setResponses({ ...responses, [fieldId]: value });
  };

  const handleSubmit = async () => {
    if (!selectedForm) return;

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You must be logged in to submit responses.');
        return;
      }

      const submissionData = {
        formId: selectedForm._id,
        responses,
      };

      const response = await fetch(API_ENDPOINTS.SUBMISSIONS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(submissionData),
      });

      const result = await response.json();

      if (response.ok) {
        alert('Response submitted successfully! 🎉');
        setSubmittedForms([...submittedForms, selectedForm]);
        setForms(forms.filter((form) => form._id !== selectedForm._id));
        setSelectedForm(null);
        setResponses({});
      } else {
        alert(`Error: ${result.message || 'Server returned error: ' + response.status}`);
      }
    } catch (error) {
      alert(`Failed to submit response. Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Navbar user={currentUser} />
      <div className="max-w-4xl mx-auto p-6 sm:p-8">
        {!selectedForm ? (
          <div>
            <h2 className="text-2xl font-bold mb-4">Available Forms</h2>
            <div className="space-y-4">
              {forms.map((form) => (
                <div key={form._id} className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow duration-200">
                  <h3 className="text-lg font-semibold">{form.title}</h3>
                  <p className="text-gray-600">{form.description}</p>
                  <Button
                    onClick={() => setSelectedForm(form)}
                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                  >
                    Fill Form
                  </Button>
                </div>
              ))}
            </div>

            {submittedForms.length > 0 && (
              <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Submitted Forms</h2>
                <div className="space-y-4">
                  {submittedForms.map((form) => (
                    <div key={form._id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                      <h3 className="text-lg font-semibold">{form.title}</h3>
                      <p className="text-gray-600">{form.description}</p>
                      <p className="text-green-600 font-bold">Submitted ✅</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold mb-4">{selectedForm.title}</h2>
            <p className="text-gray-600 mb-6">{selectedForm.description}</p>
            <div className="space-y-4">
              {selectedForm.fields.map((field, index) => (
                <FormField
                  key={index}
                  label={field.label}
                  value={responses[field._id] || ''}
                  onChange={(e) => handleResponseChange(field._id, e.target.value)}
                  type={field.type === 'dropdown' ? 'select' : field.type}
                  options={field.options || []}
                />
              ))}
            </div>
            <div className="flex gap-4 mt-6">
              <Button
                onClick={() => setSelectedForm(null)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting... ⏳' : 'Submit Response'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
