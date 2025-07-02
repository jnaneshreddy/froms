import React from 'react';

const FormField = ({ label, value, onChange, placeholder, type = 'text', options = [] }) => {
  // Render checkbox options
  const renderCheckboxOptions = () => {
    return (
      <div className="space-y-2">
        {options.map((option, index) => (
          <label key={index} className="flex items-center space-x-2">
            <input
              type="checkbox"
              value={option}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span className="text-gray-700">{option}</span>
          </label>
        ))}
      </div>
    );
  };

  // Render field based on type
  const renderField = () => {
    switch (type) {
      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full p-2 border rounded"
          />
        );
      case 'select':
        return (
          <select
            value={value}
            onChange={onChange}
            className="w-full p-2 border rounded"
          >
            <option value="" disabled>Select an option</option>
            {options.map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
        );
      case 'checkbox':
        return renderCheckboxOptions();
      default:
        return (
          <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full p-2 border rounded"
          />
        );
    }
  };

  return (
    <div className="mb-4">
      <label className="block font-semibold mb-1">{label}</label>
      {renderField()}
    </div>
  );
};

export default FormField;
