import { useState, useRef, useEffect, useCallback } from 'react';
import { apolloClient } from '../../../lib/apollo';
import { SEARCH_OCCUPATIONS } from '../../../graphql/queries/salary';
import { useDebounce } from '../../../hooks/useDebounce';

interface Occupation {
  id: string;
  name: string;
}

interface OccupationAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelect?: (occupation: Occupation) => void;
  error?: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

const OccupationAutocomplete = ({
  value,
  onChange,
  onSelect,
  error,
  label = 'Occupation',
  placeholder = 'Start typing an occupation...',
  required = false,
  disabled = false,
}: OccupationAutocompleteProps) => {
  const [suggestions, setSuggestions] = useState<Occupation[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [searchError, setSearchError] = useState<string | null>(null);
  
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedSearchTerm = useDebounce(value, 300);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setHighlightIndex(-1);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search occupations when debounced value changes
  useEffect(() => {
    if (debouncedSearchTerm && debouncedSearchTerm.length >= 2) {
      searchOccupations(debouncedSearchTerm);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  }, [debouncedSearchTerm]);

  const searchOccupations = async (searchTerm: string) => {
    setLoading(true);
    setSearchError(null);

    try {
      const result = await apolloClient.query<{ searchOccupations: Occupation[] }>({
        query: SEARCH_OCCUPATIONS,
        variables: { searchTerm, limit: 8 },
        fetchPolicy: 'network-only',
      });

      if (result.data?.searchOccupations) {
        setSuggestions(result.data.searchOccupations);
        setIsOpen(result.data.searchOccupations.length > 0);
        setHighlightIndex(-1);
      } else {
        setSuggestions([]);
        setIsOpen(false);
      }
    } catch (err) {
      console.error('Failed to search occupations:', err);
      setSearchError('Failed to load suggestions');
      setSuggestions([]);
      setIsOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setIsOpen(true);
  };

  const handleSelectSuggestion = (occupation: Occupation) => {
    onChange(occupation.name);
    setSuggestions([]);
    setIsOpen(false);
    setHighlightIndex(-1);
    if (onSelect) {
      onSelect(occupation);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      
      case 'ArrowUp':
        e.preventDefault();
        setHighlightIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      
      case 'Enter':
        e.preventDefault();
        if (highlightIndex >= 0 && suggestions[highlightIndex]) {
          handleSelectSuggestion(suggestions[highlightIndex]);
        }
        break;
      
      case 'Escape':
        setIsOpen(false);
        setHighlightIndex(-1);
        break;
    }
  };

  const handleFocus = () => {
    if (suggestions.length > 0) {
      setIsOpen(true);
    }
  };

  // Highlight matching text
  const highlightMatch = (text: string, search: string) => {
    if (!search) return text;
    
    const regex = new RegExp(`(${search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <strong key={index} className="text-blue-600 font-semibold">{part}</strong>
      ) : (
        <span key={index}>{part}</span>
      )
    );
  };

  return (
    <div ref={wrapperRef} className="relative">
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Input with Icon */}
      <div className="relative">
        {/* Search Icon */}
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          autoComplete="off"
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-autocomplete="list"
          className={`w-full pl-10 pr-10 py-2.5 border rounded-lg shadow-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors ${
            error
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        />

        {/* Loading Spinner or Clear Button */}
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          {loading ? (
            <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : value ? (
            <button
              type="button"
              onClick={() => {
                onChange('');
                inputRef.current?.focus();
              }}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Clear"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          ) : null}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <p className="mt-1.5 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      {/* Dropdown Suggestions */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-xl border border-gray-200 max-h-60 overflow-y-auto">
          <div className="py-1" role="listbox">
            {suggestions.map((occupation, index) => (
              <button
                key={occupation.id}
                type="button"
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                  index === highlightIndex
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => handleSelectSuggestion(occupation)}
                onMouseEnter={() => setHighlightIndex(index)}
                role="option"
                aria-selected={index === highlightIndex}
              >
                <div className="flex items-center justify-between">
                  <span>{highlightMatch(occupation.name, debouncedSearchTerm)}</span>
                  <svg className="w-4 h-4 text-gray-400 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            ))}
          </div>
          
          {/* Footer */}
          <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 text-xs text-gray-400 flex items-center justify-between">
            <span>{suggestions.length} suggestions</span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-gray-200 rounded text-xs">↑↓</kbd>
              <span>navigate</span>
              <kbd className="px-1.5 py-0.5 bg-gray-200 rounded text-xs ml-1">↵</kbd>
              <span>select</span>
            </span>
          </div>
        </div>
      )}

      {/* No Results */}
      {isOpen && suggestions.length === 0 && debouncedSearchTerm.length >= 2 && !loading && (
        <div className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-xl border border-gray-200">
          <div className="px-4 py-3 text-sm text-gray-500 text-center">
            No occupations found for "{debouncedSearchTerm}"
          </div>
        </div>
      )}

      {/* Search Error */}
      {searchError && (
        <p className="mt-1 text-sm text-yellow-600">{searchError}</p>
      )}
    </div>
  );
};

export default OccupationAutocomplete;