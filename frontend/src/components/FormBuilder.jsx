import React, { useState, useEffect } from 'react';
import FormField from './FormField';
import Button from './Button';
import { API_ENDPOINTS, getAuthHeaders } from '../utils/api';

const FormBuilder = ({ onSave, formToEdit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [fields, setFields] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (formToEdit) {
      setTitle(formToEdit.title);
      setDescription(formToEdit.description);
      setFields(formToEdit.fields);
    }
  }, [formToEdit]);

  const handleSave = async () => {
    if (!title || fields.length === 0) {
      alert('Title and at least one field are required.');
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You must be logged in to create or edit forms.');
        return;
      }

      const formData = { title, description, fields };
      const url = formToEdit
        ? API_ENDPOINTS.FORM_BY_ID(formToEdit._id)
        : API_ENDPOINTS.FORMS;
      const method = formToEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        alert(formToEdit ? 'Form updated successfully! 🎉' : 'Form created successfully! 🎉');
        setTitle('');
        setDescription('');
        setFields([]);
        if (onSave) {
          onSave(result);
        }
      } else {
        alert(`Error: ${result.message || 'Server returned error: ' + response.status}`);
      }
    } catch (error) {
      alert(`Failed to save form. Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  
  const handleOptionChange = (fieldIndex, optionIndex, value) => {
    const updatedFields = [...fields];
    updatedFields[fieldIndex].options[optionIndex] = value;
    setFields(updatedFields);
  };

  const addOption = (fieldIndex) => {
    const updatedFields = [...fields];
    if (!updatedFields[fieldIndex].options) {
      updatedFields[fieldIndex].options = [];
    }
    updatedFields[fieldIndex].options.push('');
    setFields(updatedFields);
  };

  const removeOption = (fieldIndex, optionIndex) => {
    const updatedFields = [...fields];
    updatedFields[fieldIndex].options.splice(optionIndex, 1);
    setFields(updatedFields);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 sm:p-8">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 sm:px-8 py-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            {formToEdit ? 'Edit Form' : 'Create a New Form'}
          </h2>
          <p className="text-blue-100">
            {formToEdit ? 'Modify your form details' : 'Build your custom form with ease'}
          </p>
        </div>

        <div className="p-6 sm:p-8 space-y-8">
          {/* Form Details Section */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FormField
                label="Form Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter an engaging form title"
              />
              <FormField
                label="Form Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what this form is for"
                type="textarea"
              />
            </div>
          </div>

          {/* Fields Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800 flex items-center">
                <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                  {fields.length}
                </span>
                Form Fields
              </h3>
              <Button
                onClick={() => setFields([...fields, { label: '', type: 'text' }])}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-2 rounded-lg shadow-md transition-all duration-200 transform hover:scale-105"
              >
                + Add Field
              </Button>
            </div>

            {fields.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                <div className="text-gray-400 text-4xl mb-4">📝</div>
                <p className="text-gray-500 text-lg">No fields added yet</p>
                <p className="text-gray-400 text-sm">Click "Add Field" to get started</p>
              </div>
            ) : (
              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div key={index} className="bg-gray-50 rounded-xl p-4 sm:p-6 border border-gray-200 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-gray-700">Field {index + 1}</h4>
                      <button
                        onClick={() => setFields(fields.filter((_, i) => i !== index))}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors duration-200"
                        title="Remove field"
                      >
                        🗑️
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        label="Field Label"
                        value={field.label}
                        onChange={(e) => {
                          const updatedFields = [...fields];
                          updatedFields[index].label = e.target.value;
                          setFields(updatedFields);
                        }}
                        placeholder="Enter field label"
                      />
                      <div className="flex flex-col space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Field Type</label>
                        <select
                          value={field.type}
                          onChange={(e) => {
                            const updatedFields = [...fields];
                            updatedFields[index].type = e.target.value;
                            setFields(updatedFields);
                          }}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                        >
                          <option value="text">📝 Text Input</option>
                          <option value="number">🔢 Number Input</option>
                          <option value="dropdown">📋 Dropdown</option>
                          <option value="checkbox">☑️ Checkbox</option>
                        </select>
                      </div>
                    </div>

                    {/* Options for Dropdown and Checkbox fields */}
                    {field.type === 'dropdown' || field.type === 'checkbox' ? (
                      <div className="space-y-2 mt-4">
                        <label className="text-sm font-semibold text-gray-700">Options</label>
                        {field.options && field.options.map((option, optionIndex) => (
                          <div key={optionIndex} className="flex items-center space-x-2">
                            <input
                              type="text"
                              value={option}
                              onChange={(e) => handleOptionChange(index, optionIndex, e.target.value)}
                              className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                              placeholder="Enter option"
                            />
                            <button
                              onClick={() => removeOption(index, optionIndex)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors duration-200"
                              title="Remove option"
                            >
                              🗑️
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => addOption(index)}
                          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2 rounded-lg shadow-md transition-all duration-200 transform hover:scale-105"
                        >
                          + Add Option
                        </button>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
            <Button
              onClick={() => {
                setTitle('');
                setDescription('');
                setFields([]);
              }}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg font-semibold transition-colors duration-200"
            >
              Clear Form
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-lg font-semibold shadow-lg transition-all duration-200 transform hover:scale-105"
              disabled={!title || fields.length === 0 || isLoading}
            >
              {isLoading ? (formToEdit ? 'Updating Form... ⏳' : 'Creating Form... ⏳') : (formToEdit ? 'Update Form ✨' : 'Save Form ✨')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormBuilder;
