import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEye, FaEyeSlash, FaCheck, FaTimes, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';

const FormField = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  error = null,
  success = false,
  helpText = null,
  options = [],
  rows = 4,
  min,
  max,
  step,
  pattern,
  className = '',
  icon: Icon = null,
  onFocus,
  onBlur,
  autoComplete,
  id
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const fieldId = id || `field-${Math.random().toString(36).substr(2, 9)}`;

  const handleFocus = (e) => {
    setIsFocused(true);
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };

  // Format phone number display
  const formatPhoneDisplay = (phone) => {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    
    // Indonesian format
    if (cleaned.startsWith('62')) {
      const withoutCountry = cleaned.slice(2);
      if (withoutCountry.length <= 3) return `+62 ${withoutCountry}`;
      if (withoutCountry.length <= 7) return `+62 ${withoutCountry.slice(0, 3)}-${withoutCountry.slice(3)}`;
      return `+62 ${withoutCountry.slice(0, 3)}-${withoutCountry.slice(3, 7)}-${withoutCountry.slice(7)}`;
    } else if (cleaned.startsWith('0')) {
      if (cleaned.length <= 4) return cleaned;
      if (cleaned.length <= 8) return `${cleaned.slice(0, 4)}-${cleaned.slice(4)}`;
      return `${cleaned.slice(0, 4)}-${cleaned.slice(4, 8)}-${cleaned.slice(8)}`;
    }
    return phone;
  };

  // Handle phone input with only numbers
  const handlePhoneChange = (e) => {
    const value = e.target.value;
    // Allow only numbers, +, -, and spaces for display, but store only numbers
    const cleanValue = value.replace(/[^\d+\-\s]/g, '');
    onChange(cleanValue);
  };

  return (
    <motion.div
      className="form-field-container space-y-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {label && (
        <label htmlFor={fieldId} className="form-label block text-sm font-medium text-white flex items-center gap-2">
          {Icon && <Icon className="w-4 h-4 text-primary-400" />}
          {label}
          {required && <span className="required-indicator text-red-400 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {type === 'textarea' ? (
          <textarea
            id={fieldId}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            rows={rows}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={`glassmorphic-input resize-none transition-all duration-300 ${
              error ? 'error border-red-400/50 shadow-red-400/10' : 
              success ? 'success border-green-400/50 shadow-green-400/10' : 
              isFocused ? 'border-primary-400/50 shadow-primary-400/10' : 'border-white/20'
            } ${className}`}
            style={{
              minHeight: `${rows * 1.5}rem`
            }}
          />
        ) : type === 'select' ? (
          <select
            id={fieldId}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            required={required}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={`glassmorphic-input glassmorphic-select appearance-none transition-all duration-300 ${
              error ? 'error border-red-400/50' : 
              success ? 'success border-green-400/50' : 
              isFocused ? 'border-primary-400/50' : 'border-white/20'
            } ${className}`}
          >
            {placeholder && (
              <option value="" disabled className="bg-dark-800 text-gray-400">
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option 
                key={option.value} 
                value={option.value}
                className="bg-dark-800 text-white hover:bg-dark-700"
              >
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            id={fieldId}
            type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
            value={type === 'tel' ? formatPhoneDisplay(value || '') : (value || '')}
            onChange={type === 'tel' ? handlePhoneChange : (e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            min={min}
            max={max}
            step={step}
            pattern={pattern}
            autoComplete={autoComplete}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={`glassmorphic-input transition-all duration-300 ${
              error ? 'error border-red-400/50 shadow-red-400/10' : 
              success ? 'success border-green-400/50 shadow-green-400/10' : 
              isFocused ? 'border-primary-400/50 shadow-primary-400/10' : 'border-white/20'
            } ${type === 'password' ? 'pr-12' : ''} ${
              type === 'tel' ? 'phone-input font-mono' : ''
            } ${className}`}
          />
        )}

        {/* Status Icons */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
          {/* Password Toggle */}
          {type === 'password' && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              {showPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
            </button>
          )}

          {/* Success Icon */}
          {success && !error && (
            <FaCheck className="w-4 h-4 text-green-400" />
          )}

          {/* Error Icon */}
          {error && (
            <FaExclamationTriangle className="w-4 h-4 text-red-400" />
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="error-message flex items-center gap-2 text-red-400 text-sm"
        >
          <FaExclamationTriangle className="validation-icon w-3 h-3 flex-shrink-0" />
          <span>{error}</span>
        </motion.div>
      )}

      {/* Success Message */}
      {success && !error && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="success-message flex items-center gap-2 text-green-400 text-sm"
        >
          <FaCheck className="validation-icon w-3 h-3 flex-shrink-0" />
          <span>✅ Data valid</span>
        </motion.div>
      )}

      {/* Help Text */}
      {helpText && !error && (
        <p className="help-text flex items-center gap-1 text-gray-400 text-xs">
          <FaInfoCircle className="w-3 h-3 text-gray-500 flex-shrink-0" />
          {helpText}
        </p>
      )}
    </motion.div>
  );
};

export default FormField;