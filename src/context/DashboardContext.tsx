import React, { createContext, useState, useContext, useCallback } from 'react';
import { DashboardState, Transaction, UserRole, TransactionType } from '../types/index';
import { MOCK_TRANSACTIONS } from '../types/mockData';

interface DashboardContextType extends DashboardState {
  setUserRole: (role: UserRole) => void;
  toggleDarkMode: () => void;
  setSearchTerm: (term: string) => void;
  setCategoryFilter: (category?: string) => void;
  setTypeFilter: (type?: TransactionType) => void;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  editTransaction: (id: string, transaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  getFilteredTransactions: () => Transaction[];
  exportToJSON: () => void;
  exportToCSV: () => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<DashboardState>(() => {
    // Load from localStorage if available
    const saved = localStorage.getItem('dashboardState');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback to default state
      }
    }
    return {
      transactions: MOCK_TRANSACTIONS,
      userRole: 'viewer',
      selectedFilters: {},
      darkMode: false,
    };
  });

  // Persist state to localStorage
  const updateState = (newState: DashboardState) => {
    setState(newState);
    localStorage.setItem('dashboardState', JSON.stringify(newState));
  };

  const setUserRole = (role: UserRole) => {
    updateState({ ...state, userRole: role });
  };

  const toggleDarkMode = () => {
    const newDarkMode = !state.darkMode;
    updateState({ ...state, darkMode: newDarkMode });
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const setSearchTerm = (searchTerm: string) => {
    updateState({
      ...state,
      selectedFilters: { ...state.selectedFilters, searchTerm },
    });
  };

  const setCategoryFilter = (category?: string) => {
    updateState({
      ...state,
      selectedFilters: { ...state.selectedFilters, category },
    });
  };

  const setTypeFilter = (type?: TransactionType) => {
    updateState({
      ...state,
      selectedFilters: { ...state.selectedFilters, type },
    });
  };

  const getFilteredTransactions = useCallback((): Transaction[] => {
    return state.transactions.filter((transaction) => {
      const { category, type, searchTerm } = state.selectedFilters;

      if (category && transaction.category !== category) return false;
      if (type && transaction.type !== type) return false;
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        return (
          transaction.description.toLowerCase().includes(search) ||
          transaction.category.toLowerCase().includes(search)
        );
      }

      return true;
    });
  }, [state.transactions, state.selectedFilters]);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    updateState({
      ...state,
      transactions: [newTransaction, ...state.transactions],
    });
  };

  const editTransaction = (id: string, transaction: Omit<Transaction, 'id'>) => {
    updateState({
      ...state,
      transactions: state.transactions.map((t) =>
        t.id === id ? { ...transaction, id } : t
      ),
    });
  };

  const deleteTransaction = (id: string) => {
    updateState({
      ...state,
      transactions: state.transactions.filter((t) => t.id !== id),
    });
  };

  const exportToJSON = () => {
    const data = JSON.stringify(getFilteredTransactions(), null, 2);
    downloadFile(data, 'transactions.json', 'application/json');
  };

  const exportToCSV = () => {
    const transactions = getFilteredTransactions();
    const headers = ['Date', 'Amount', 'Category', 'Type', 'Description'];
    const rows = transactions.map((t) => [
      t.date,
      t.amount,
      t.category,
      t.type,
      t.description,
    ]);

    const csv = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    downloadFile(csv, 'transactions.csv', 'text/csv');
  };

  const value: DashboardContextType = {
    ...state,
    setUserRole,
    toggleDarkMode,
    setSearchTerm,
    setCategoryFilter,
    setTypeFilter,
    addTransaction,
    editTransaction,
    deleteTransaction,
    getFilteredTransactions,
    exportToJSON,
    exportToCSV,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = (): DashboardContextType => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within DashboardProvider');
  }
  return context;
};

function downloadFile(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
