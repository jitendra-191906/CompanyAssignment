import React from 'react';
import { Search, X } from 'lucide-react';
import '../styles/SearchBar.css';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search transactions...',
}) => {
  return (
    <div className="search-bar">
      <div className="search-icon">
        <Search size={20} />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="search-input"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="search-clear-btn"
          title="Clear search"
        >
          <X size={20} />
        </button>
      )}
    </div>
  );
};
