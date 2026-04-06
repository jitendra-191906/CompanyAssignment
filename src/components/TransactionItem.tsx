import React, { useState } from 'react';
import { Edit2, Trash2, Save, X } from 'lucide-react';
import { Button } from './Button';
import { Select } from './Select';
import { useDashboard } from '../context/DashboardContext';
import { Transaction, TransactionType } from '../types/index';
import { CATEGORIES } from '../types/mockData';
import '../styles/TransactionItem.css';

interface TransactionItemProps {
  transaction: Transaction;
  isAdmin: boolean;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({ transaction, isAdmin }) => {
  const { deleteTransaction, editTransaction, darkMode } = useDashboard();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(transaction);

  const handleSave = () => {
    editTransaction(transaction.id, editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(transaction);
    setIsEditing(false);
  };

  const isIncome = transaction.type === 'income';

  const inputStyle: React.CSSProperties = {
    padding: '0.5rem 0.75rem',
    border: `1px solid var(--border-color)`,
    borderRadius: '0.375rem',
    backgroundColor: 'var(--bg-primary)',
    color: 'var(--text-primary)',
    fontSize: '1rem',
    transition: 'all 0.2s ease',
  };

  if (isEditing && isAdmin) {
    return (
      <div className="transaction-item" style={{ border: '2px solid #059669' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.75rem' }}>
            <input
              type="date"
              value={editData.date}
              onChange={(e) => setEditData({ ...editData, date: e.target.value })}
              style={inputStyle}
            />
            <input
              type="number"
              step="0.01"
              value={editData.amount}
              onChange={(e) => setEditData({ ...editData, amount: parseFloat(e.target.value) })}
              style={inputStyle}
            />
            <Select
              options={[
                { value: 'expense', label: 'Expense' },
                { value: 'income', label: 'Income' },
              ]}
              value={editData.type}
              onChange={(e) => setEditData({ ...editData, type: e.target.value as TransactionType })}
            />
            <Select
              options={CATEGORIES.map((cat) => ({ value: cat, label: cat }))}
              value={editData.category}
              onChange={(e) => setEditData({ ...editData, category: e.target.value })}
            />
            <input
              type="text"
              value={editData.description}
              onChange={(e) => setEditData({ ...editData, description: e.target.value })}
              placeholder="Description"
              style={inputStyle}
            />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button size="sm" onClick={handleSave} icon={<Save size={16} />}>
              Save
            </Button>
            <Button size="sm" variant="secondary" onClick={handleCancel} icon={<X size={16} />}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`transaction-item transaction-item--${isIncome ? 'income' : 'expense'}`}>
      <div className="transaction-item__left">
        <div className={`transaction-item__icon transaction-item__icon--${isIncome ? 'income' : 'expense'}`}>
          {isIncome ? '💰' : '💸'}
        </div>
        <div className="transaction-item__details">
          <h4 className="transaction-item__title">{transaction.category}</h4>
          <p className="transaction-item__category">{transaction.description}</p>
          <p className="transaction-item__date">
            {new Date(transaction.date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
        </div>
      </div>

      <div className="transaction-item__amount">
        <p className={`transaction-item__value transaction-item__value--${isIncome ? 'income' : 'expense'}`}>
          {isIncome ? '+' : '-'}${transaction.amount.toFixed(2)}
        </p>
      </div>

      {isAdmin && (
        <div className="transaction-item__actions">
          <button
            onClick={() => setIsEditing(true)}
            className="transaction-action-btn transaction-action-btn--edit"
            title="Edit"
          >
            <Edit2 size={18} />
          </button>
          <button
            onClick={() => deleteTransaction(transaction.id)}
            className="transaction-action-btn transaction-action-btn--delete"
            title="Delete"
          >
            <Trash2 size={18} />
          </button>
        </div>
      )}
    </div>
  );
};

