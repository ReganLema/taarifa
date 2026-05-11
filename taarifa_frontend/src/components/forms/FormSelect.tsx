import { forwardRef, useState } from 'react';
import type { ReactNode } from 'react';

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  description?: string;
  icon?: ReactNode;
}

interface SelectGroup {
  label: string;
  options: SelectOption[];
}

interface FormSelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size' | 'children'> {
  label?: string;
  error?: string;
  helperText?: string;
  hint?: string;
  options: SelectOption[] | SelectGroup[];
  placeholder?: string;
  icon?: ReactNode;
  fullWidth?: boolean;
  variant?: 'outlined' | 'filled';
  fieldSize?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  success?: boolean;
  required?: boolean;
  optional?: boolean;
  hideLabel?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  onClear?: () => void;
  emptyMessage?: string;
}

const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  (
    {
      label,
      error,
      helperText,
      hint,
      options,
      placeholder = 'Select an option',
      icon,
      fullWidth = true,
      variant = 'outlined',
      fieldSize = 'md',
      loading = false,
      success = false,
      required = false,
      optional = false,
      hideLabel = false,
      searchable = false,
      clearable = false,
      onClear,
      emptyMessage = 'No options available',
      className = '',
      id,
      disabled,
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-') || Math.random().toString(36).substr(2, 9);
    const [searchTerm, setSearchTerm] = useState('');

    // Base styles
    const baseStyles = 'block w-full rounded-md shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed appearance-none bg-white';
    
    // Size styles
    const sizeStyles = {
      sm: 'px-2.5 py-1.5 text-sm',
      md: 'px-3 py-2 text-base',
      lg: 'px-4 py-3 text-lg',
    };

    // Variant styles
    const variantStyles = {
      outlined: 'border text-gray-900 focus:border-blue-500 focus:ring-blue-500',
      filled: 'border border-transparent bg-gray-100 text-gray-900 focus:bg-white focus:border-blue-500 focus:ring-blue-500',
    };

    // State styles
    const errorStyles = error ? 'border-red-300 focus:border-red-500 focus:ring-red-500 text-red-900' : '';
    const successStyles = success && !error ? 'border-green-300 focus:border-green-500 focus:ring-green-500' : '';

    // Icon padding
    const iconPadding = icon ? 'pl-10' : '';

    // Combine styles
    const selectClasses = [
      baseStyles,
      sizeStyles[fieldSize],
      variantStyles[variant],
      errorStyles,
      successStyles,
      iconPadding,
      fullWidth ? 'w-full' : '',
      className,
    ].filter(Boolean).join(' ');

    // Flatten options if groups are provided
    const getFlattenedOptions = (): SelectOption[] => {
      if (options.length === 0) return [];
      
      if ('options' in options[0]) {
        return (options as SelectGroup[]).flatMap(group => group.options);
      }
      
      return options as SelectOption[];
    };

    // Filter options based on search term
    const filteredOptions = searchable && searchTerm
      ? getFlattenedOptions().filter(option =>
          option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
          option.description?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : getFlattenedOptions();

    // Check if groups exist
    const isGrouped = options.length > 0 && 'options' in options[0];

    // Get selected option
    const selectedOption = getFlattenedOptions().find(opt => opt.value === value);

    // Handle clear
    const handleClear = () => {
      if (onClear) {
        onClear();
      }
      setSearchTerm('');
    };

    return (
      <div className={`flex flex-col ${fullWidth ? 'w-full' : ''}`}>
        {/* Label */}
        {label && !hideLabel && (
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor={selectId}
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
            
            {hint && (
              <span className="text-gray-400 cursor-help text-sm" title={hint}>
                ℹ️
              </span>
            )}
          </div>
        )}

        {/* Select Container */}
        <div className="relative">
          {/* Left Icon */}
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
              <span className={`${error ? 'text-red-400' : 'text-gray-400'} sm:text-sm`}>
                {icon}
              </span>
            </div>
          )}

          {/* Search Input (if searchable) */}
          {searchable && (
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={selectedOption ? selectedOption.label : 'Search...'}
              className={`absolute inset-0 z-10 bg-transparent ${selectClasses} cursor-text`}
              disabled={disabled}
            />
          )}

          {/* Select Element */}
          <select
            ref={ref}
            id={selectId}
            value={value}
            onChange={onChange}
            disabled={disabled}
            className={`${selectClasses} ${searchable ? 'opacity-0' : ''}`}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={
              error
                ? `${selectId}-error`
                : helperText
                ? `${selectId}-helper`
                : undefined
            }
            aria-required={required}
            {...props}
          >
            <option value="" disabled>
              {placeholder}
            </option>

            {isGrouped ? (
              (options as SelectGroup[]).map((group, groupIndex) => (
                <optgroup key={groupIndex} label={group.label}>
                  {group.options.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                      disabled={option.disabled}
                    >
                      {option.label}
                    </option>
                  ))}
                </optgroup>
              ))
            ) : (
              filteredOptions.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                >
                  {option.label}
                </option>
              ))
            )}
          </select>

          {/* Right Side Actions */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-8 z-20">
            {/* Clear Button */}
            {clearable && value && !disabled && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1 hover:bg-gray-200 rounded-full transition-colors mr-1"
                aria-label="Clear selection"
              >
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}

            {/* Loading Spinner */}
            {loading && (
              <svg
                className="animate-spin h-5 w-5 text-blue-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            )}

            {/* Success Icon */}
            {success && !loading && (
              <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            )}
          </div>

          {/* Dropdown Arrow */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <svg
              className={`h-5 w-5 ${error ? 'text-red-400' : success ? 'text-green-400' : 'text-gray-400'}`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        {/* Selected Option Description */}
        {selectedOption?.description && !searchable && (
          <p className="mt-1 text-xs text-gray-500">
            {selectedOption.description}
          </p>
        )}

        {/* Error Message */}
        {error && (
          <p
            id={`${selectId}-error`}
            className="mt-1.5 text-sm text-red-600 flex items-center gap-1"
            role="alert"
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}

        {/* Helper Text */}
        {helperText && !error && (
          <p
            id={`${selectId}-helper`}
            className="mt-1.5 text-sm text-gray-500"
          >
            {helperText}
          </p>
        )}

        {/* No Options Message */}
        {searchable && searchTerm && filteredOptions.length === 0 && (
          <p className="mt-1 text-sm text-gray-400 italic">
            {emptyMessage}
          </p>
        )}
      </div>
    );
  }
);

FormSelect.displayName = 'FormSelect';

export default FormSelect;