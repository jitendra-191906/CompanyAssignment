import React from 'react';
import { ChevronDown } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import '../styles/Select.css';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
  error?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  error,
  className,
  ...props
}) => {
  const { darkMode } = useDashboard();

  const selectClassName = [
    'select',
    error && 'select--error',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className="select-wrapper">
      {label && <label className="select-label">{label}</label>}
      <div className="select-box">
        <select
          className={selectClassName}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {error && <span className="select-error">{error}</span>}
    </div>
  );
};
