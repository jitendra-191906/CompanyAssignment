import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from './Button';
import { Select } from './Select';
import { useDashboard } from '../context/DashboardContext';
import { CATEGORIES } from '../types/mockData';
import { TransactionType } from '../types/index';
import '../styles/Modal.css';

export const AddTransactionModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { addTransaction, darkMode } = useDashboard();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    category: CATEGORIES[0],
    type: 'expense' as TransactionType,
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.description) return;

    addTransaction({
      date: formData.date,
      amount: parseFloat(formData.amount),
      category: formData.category,
      type: formData.type,
      description: formData.description,
    });

    setFormData({
      date: new Date().toISOString().split('T')[0],
      amount: '',
      category: CATEGORIES[0],
      type: 'expense',
      description: '',
    });
    onClose();
  };

  if (!isOpen) return null;

  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50,
    padding: '1rem',
  };

  const modalStyle: React.CSSProperties = {
    backgroundColor: 'var(--bg-primary)',
    borderRadius: '0.75rem',
    boxShadow: 'var(--shadow-lg)',
    maxWidth: '28rem',
    width: '100%',
    animation: 'scaleIn 0.3s ease-in-out',
    transition: 'all 0.2s ease',
    border: `1px solid var(--border-color)`,
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1.5rem',
    borderBottom: `1px solid var(--border-color)`,
    backgroundColor: 'var(--bg-secondary)',
    borderRadius: '0.75rem 0.75rem 0 0',
    transition: 'all 0.2s ease',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: 'var(--text-primary)',
    letterSpacing: '-0.01em',
    transition: 'color 0.2s ease',
  };

  const closeButtonStyle: React.CSSProperties = {
    backgroundColor: 'transparent',
    border: 'none',
    color: 'var(--text-tertiary)',
    cursor: 'pointer',
    padding: '0.5rem',
    transition: 'all 0.2s ease',
    borderRadius: '0.375rem',
  };

  const formStyle: React.CSSProperties = {
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  };

  const fieldStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '0.875rem',
    fontWeight: 500,
    color: 'var(--text-secondary)',
    marginBottom: '0.5rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    transition: 'color 0.2s ease',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.625rem 1rem',
    border: `1px solid var(--border-color)`,
    borderRadius: '0.5rem',
    backgroundColor: 'var(--bg-primary)',
    color: 'var(--text-primary)',
    fontSize: '0.9375rem',
    outline: 'none',
    transition: 'all 0.2s ease',
    fontWeight: 500,
  };

  const buttonGroupStyle: React.CSSProperties = {
    display: 'flex',
    gap: '0.75rem',
    paddingTop: '1rem',
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <div style={headerStyle}>
          <h2 style={titleStyle}>Add Transaction</h2>
          <button
            onClick={onClose}
            style={closeButtonStyle}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = darkMode ? '#9ca3af' : '#4b5563';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = darkMode ? '#6b7280' : '#9ca3af';
            }}
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={fieldStyle}>
            <label style={labelStyle}>Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              style={inputStyle}
              onFocus={(e) => {
                (e.target as HTMLInputElement).style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
                (e.target as HTMLInputElement).style.borderColor = '#10b981';
              }}
              onBlur={(e) => {
                (e.target as HTMLInputElement).style.boxShadow = '';
                (e.target as HTMLInputElement).style.borderColor = darkMode ? '#374151' : '#d1d5db';
              }}
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Amount</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="0.00"
              style={inputStyle}
              onFocus={(e) => {
                (e.target as HTMLInputElement).style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
                (e.target as HTMLInputElement).style.borderColor = '#10b981';
              }}
              onBlur={(e) => {
                (e.target as HTMLInputElement).style.boxShadow = '';
                (e.target as HTMLInputElement).style.borderColor = darkMode ? '#374151' : '#d1d5db';
              }}
            />
          </div>

          <Select
            label="Type"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as TransactionType })}
            options={[
              { value: 'expense', label: 'Expense' },
              { value: 'income', label: 'Income' },
            ]}
          />

          <Select
            label="Category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            options={CATEGORIES.map((cat) => ({ value: cat, label: cat }))}
          />

          <div style={fieldStyle}>
            <label style={labelStyle}>Description</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter description"
              style={inputStyle}
              onFocus={(e) => {
                (e.target as HTMLInputElement).style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
                (e.target as HTMLInputElement).style.borderColor = '#10b981';
              }}
              onBlur={(e) => {
                (e.target as HTMLInputElement).style.boxShadow = '';
                (e.target as HTMLInputElement).style.borderColor = darkMode ? '#374151' : '#d1d5db';
              }}
            />
          </div>

          <div style={buttonGroupStyle}>
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" icon={<Plus size={20} />}>
              Add
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
