// components/shared/FormComponents.jsx
// All reusable form components and UI elements

import React from 'react';
import { HelpCircle, X } from 'lucide-react';
import { colors } from '../../config/constants';
import { fieldExplanations } from '../../config/fieldExplanations';

// Hover tooltip component
export const HoverTooltip = ({ content, children }) => (
  <div className="relative group">
    {children}
    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 w-72 text-center">
      {content}
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
    </div>
  </div>
);

// Field with hover tooltip
export const FieldWithTooltip = ({ fieldKey, label, children, required = false }) => (
  <div className="space-y-2">
    <div className="flex items-center space-x-2">
      <HoverTooltip content={fieldExplanations[fieldKey] || "Explanation coming soon!"}>
        <label className="block text-sm font-medium cursor-help flex items-center space-x-1" style={{ color: colors.text }}>
          <span>{label} {required && <span className="text-red-500 font-bold">*</span>}</span>
          <HelpCircle className="w-4 h-4 opacity-60 hover:opacity-100" style={{ color: colors.primary }} />
        </label>
      </HoverTooltip>
    </div>
    {children}
  </div>
);

// Mobile-friendly rating component
export const RatingInput = ({ value, onChange, max = 10, label }) => (
  <div className="space-y-2">
    <div className="flex justify-between text-xs text-gray-600">
      <span>1 (Low)</span>
      <span className="font-medium">{value || 0}/{max}</span>
      <span>{max} (High)</span>
    </div>
    <input
      type="range"
      min="1"
      max={max}
      value={value || 0}
      onChange={(e) => onChange(parseInt(e.target.value))}
      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
      style={{
        background: `linear-gradient(to right, ${colors.primary} 0%, ${colors.primary} ${(value/max)*100}%, #e5e7eb ${(value/max)*100}%, #e5e7eb 100%)`
      }}
    />
  </div>
);

// Currency input component
export const CurrencyInput = ({ value, onChange, placeholder = "0", label, required = false, className = "" }) => (
  <div className="relative">
    <span className="absolute left-3 top-3 text-gray-500">$</span>
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
      className={`w-full pl-8 pr-3 py-3 border rounded-lg focus:ring-2 focus:outline-none ${className}`}
      style={{ borderColor: colors.border }}
      placeholder={placeholder}
      min="0"
      step="0.01"
    />
  </div>
);

// Standard text input
export const TextInput = ({ value, onChange, placeholder, className = "", type = "text" }) => (
  <input
    type={type}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className={`w-full p-3 border rounded-lg focus:ring-2 focus:outline-none ${className}`}
    style={{ borderColor: colors.border }}
    placeholder={placeholder}
  />
);

// Number input
export const NumberInput = ({ value, onChange, placeholder, className = "", min = 0, max, step = 1 }) => (
  <input
    type="number"
    value={value}
    onChange={(e) => onChange(parseInt(e.target.value) || 0)}
    className={`w-full p-3 border rounded-lg focus:ring-2 focus:outline-none ${className}`}
    style={{ borderColor: colors.border }}
    placeholder={placeholder}
    min={min}
    max={max}
    step={step}
  />
);

// Standard textarea
export const TextArea = ({ value, onChange, placeholder, rows = 3, className = "" }) => (
  <textarea
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className={`w-full p-3 border rounded-lg text-sm focus:ring-2 focus:outline-none ${className}`}
    style={{ borderColor: colors.border }}
    placeholder={placeholder}
    rows={rows}
  />
);

// Standard select dropdown
export const Select = ({ value, onChange, options, placeholder = "Select option..." }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="w-full p-3 border rounded-lg focus:ring-2 focus:outline-none"
    style={{ borderColor: colors.border }}
  >
    <option value="">{placeholder}</option>
    {options.map(option => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
);

// Notification component
export const Notification = ({ notification, onClose }) => (
  <div
    className={`p-3 rounded-lg shadow-lg text-sm max-w-sm animate-slide-in ${
      notification.type === 'success' ? 'bg-green-100 border-green-500 text-green-800' :
      notification.type === 'error' ? 'bg-red-100 border-red-500 text-red-800' :
      'bg-blue-100 border-blue-500 text-blue-800'
    } border-l-4`}
  >
    <div className="flex items-center justify-between">
      <div className="flex-1 font-medium">{notification.message}</div>
      <button
        onClick={() => onClose(notification.id)}
        className="ml-2 text-gray-500 hover:text-gray-700"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  </div>
);

// Win celebration popup
export const WinCelebration = ({ message, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-xl text-center animate-bounce">
      <div className="text-6xl mb-4">🎉</div>
      <h3 className="font-bold text-xl mb-3" style={{ color: colors.primary }}>Amazing!</h3>
      <p className="text-gray-700 mb-4 text-sm">{message}</p>
      <button 
        onClick={onClose}
        className="text-white px-6 py-2 rounded-lg hover:opacity-90 font-medium"
        style={{ backgroundColor: colors.success }}
      >
        Keep Going! 🚀
      </button>
    </div>
  </div>
);

// Challenge Questions Display Component
export const ChallengeQuestions = ({ challengeQuestions }) => (
  challengeQuestions.length > 0 && (
    <div className="mb-6 space-y-3">
      <h4 className="font-bold flex items-center text-lg" style={{ color: colors.text }}>
        <AlertTriangle className="w-5 h-5 mr-2 text-yellow-500" />
        Reality Check:
      </h4>
      {challengeQuestions.map((challenge, index) => (
        <div
          key={index}
          className={`p-4 rounded-lg border-l-4 text-sm ${
            challenge.type === 'error' ? 'bg-red-50 border-red-500 text-red-800' :
            'bg-yellow-50 border-yellow-500 text-yellow-800'
          }`}
        >
          <div className="font-medium mb-2">
            {challenge.type === 'error' ? '🚫 IMPORTANT:' : '⚠️ CONSIDER:'}
          </div>
          <div className="leading-relaxed">{challenge.question}</div>
        </div>
      ))}
    </div>
  )
);

// Safe number formatting functions
export const formatCurrency = (value) => {
  const num = parseFloat(value) || 0;
  return isNaN(num) ? '0' : Math.round(num * 100) / 100;
};

export const formatCurrencyString = (value) => {
  return `$${formatCurrency(value).toLocaleString()}`;
};

// Button component
export const Button = ({ onClick, children, variant = "primary", disabled = false, className = "" }) => {
  const getButtonStyles = () => {
    switch (variant) {
      case "secondary":
        return `bg-gray-500 hover:bg-gray-600 text-white`;
      case "success":
        return `text-white hover:opacity-90`;
      case "danger":
        return `bg-red-500 hover:bg-red-600 text-white`;
      default:
        return `text-white hover:opacity-90`;
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 ${getButtonStyles()} ${className}`}
      style={variant === "primary" ? { backgroundColor: colors.primary } : variant === "success" ? { backgroundColor: colors.success } : {}}
    >
      {children}
    </button>
  );
};