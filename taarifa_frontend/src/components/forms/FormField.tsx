import { forwardRef } from 'react';
import type { ReactNode } from 'react';

interface FormFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  hint?: string;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  rightElement?: ReactNode;
  fullWidth?: boolean;
  variant?: 'outlined' | 'filled' | 'underlined';
  fieldSize?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  success?: boolean;
  required?: boolean;
  optional?: boolean;
  hideLabel?: boolean;
}

const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  (
    {
      label,
      error,
      helperText,
      hint,
      icon,
      iconPosition = 'left',
      rightElement,
      fullWidth = true,
      variant = 'outlined',
      fieldSize = 'md',
      loading = false,
      success = false,
      required = false,
      optional = false,
      hideLabel = false,
      className = '',
      id,
      disabled,
      type = 'text',
      ...props
    },
    ref
  ) => {
    const fieldId = id || label?.toLowerCase().replace(/\s+/g, '-') || Math.random().toString(36).substr(2, 9);

    // Base styles
    const baseStyles = 'block w-full rounded-md shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed';
    
    // Size styles
    const sizeStyles = {
      sm: 'px-2.5 py-1.5 text-sm',
      md: 'px-3 py-2 text-base',
      lg: 'px-4 py-3 text-lg',
    };

    // Variant styles
    const variantStyles = {
      outlined: 'border bg-white text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500',
      filled: 'border border-transparent bg-gray-100 text-gray-900 placeholder-gray-400 focus:bg-white focus:border-blue-500 focus:ring-blue-500',
      underlined: 'border-0 border-b-2 border-gray-300 bg-transparent rounded-none px-1 focus:border-blue-500 focus:ring-0',
    };

    // State styles
    const errorStyles = error ? 'border-red-300 focus:border-red-500 focus:ring-red-500 text-red-900 placeholder-red-300' : '';
    const successStyles = success && !error ? 'border-green-300 focus:border-green-500 focus:ring-green-500' : '';
    const disabledStyles = disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : '';

    // Icon padding
    const iconLeftPadding = icon && iconPosition === 'left' ? 'pl-10' : '';
    const iconRightPadding = (icon && iconPosition === 'right') || rightElement ? 'pr-10' : '';

    // Combine all styles
    const inputClasses = [
      baseStyles,
      sizeStyles[fieldSize],
      variantStyles[variant],
      errorStyles,
      successStyles,
      disabledStyles,
      iconLeftPadding,
      iconRightPadding,
      fullWidth ? 'w-full' : '',
      className,
    ].filter(Boolean).join(' ');

    return (
      <div className={`flex flex-col ${fullWidth ? 'w-full' : ''}`}>
        {/* Label */}
        {label && !hideLabel && (
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor={fieldId}
              className={`block text-sm font-medium ${
                error ? 'text-red-600' : 'text-gray-700'
              }`}
            >
              {label}
              {required && (
                <span className="text-red-500 ml-1" aria-hidden="true">*</span>
              )}
              {optional && (
                <span className="text-gray-400 text-xs ml-1">(optional)</span>
              )}
            </label>
            
            {/* Hint tooltip */}
            {hint && (
              <span 
                className="text-gray-400 cursor-help text-sm"
                title={hint}
              >
                ℹ️
              </span>
            )}
          </div>
        )}

        {/* Input Container */}
        <div className="relative">
          {/* Left Icon */}
          {icon && iconPosition === 'left' && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className={`${error ? 'text-red-400' : 'text-gray-400'} sm:text-sm`}>
                {icon}
              </span>
            </div>
          )}

          {/* Input */}
          <input
            ref={ref}
            id={fieldId}
            type={type}
            disabled={disabled}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={
              error
                ? `${fieldId}-error`
                : helperText
                ? `${fieldId}-helper`
                : undefined
            }
            aria-required={required}
            className={inputClasses}
            {...props}
          />

          {/* Loading Spinner */}
          {loading && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <svg
                className="animate-spin h-5 w-5 text-blue-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>
          )}

          {/* Success Icon */}
          {success && !loading && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <svg
                className="h-5 w-5 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}

          {/* Right Icon */}
          {icon && iconPosition === 'right' && !loading && !success && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className={`${error ? 'text-red-400' : 'text-gray-400'} sm:text-sm`}>
                {icon}
              </span>
            </div>
          )}

          {/* Right Element (for buttons, dropdowns, etc.) */}
          {rightElement && !loading && !success && (
            <div className="absolute inset-y-0 right-0 flex items-center">
              {rightElement}
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <p
            id={`${fieldId}-error`}
            className="mt-1.5 text-sm text-red-600 flex items-center gap-1"
            role="alert"
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        )}

        {/* Helper Text */}
        {helperText && !error && (
          <p
            id={`${fieldId}-helper`}
            className="mt-1.5 text-sm text-gray-500"
          >
            {helperText}
          </p>
        )}

        {/* Character Count (for text inputs with maxLength) */}
        {props.maxLength && typeof props.value === 'string' && (
          <div className="mt-1 text-xs text-gray-400 text-right">
            {props.value.length}/{props.maxLength}
          </div>
        )}
      </div>
    );
  }
);

FormField.displayName = 'FormField';

export default FormField;