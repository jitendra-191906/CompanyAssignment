import { Download, Plus } from 'lucide-react';
import React, { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { TransactionType } from '../types/index';
import { CATEGORIES } from '../types/mockData';
import { AddTransactionModal } from './AddTransactionModal';
import { Button } from './Button';
import { Card } from './Card';
import { SearchBar } from './SearchBar';
import { Select } from './Select';
import '../styles/TransactionsSection.css';
import { TransactionItem } from './TransactionItem';

export const TransactionsSection: React.FC = () => {
      const {
            getFilteredTransactions,
            userRole,
            selectedFilters,
            setSearchTerm,
            setCategoryFilter,
            setTypeFilter,
            exportToJSON,
            exportToCSV,
            darkMode,
      } = useDashboard();

      const [isModalOpen, setIsModalOpen] = useState(false);
      const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');

      const filteredTransactions = getFilteredTransactions();
      const sorted = [...filteredTransactions].sort((a, b) => {
            if (sortBy === 'date') {
                  return new Date(b.date).getTime() - new Date(a.date).getTime();
            }
            return b.amount - a.amount;
      });

      return (
            <>
                  <Card
                        title="Transactions"
                        headerAction={
                              userRole === 'admin' && (
                                    <Button
                                          size="sm"
                                          icon={<Plus size={18} />}
                                          onClick={() => setIsModalOpen(true)}
                                    >
                                          Add
                                    </Button>
                              )
                        }
                  >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                              {/* Filters */}
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
                                    <SearchBar
                                          value={selectedFilters.searchTerm || ''}
                                          onChange={setSearchTerm}
                                          placeholder="Search transactions..."
                                    />
                                    <Select
                                          options={[
                                                { value: '', label: 'All Types' },
                                                { value: 'income', label: 'Income' },
                                                { value: 'expense', label: 'Expense' },
                                          ]}
                                          value={selectedFilters.type || ''}
                                          onChange={(e) =>
                                                setTypeFilter(e.target.value ? (e.target.value as TransactionType) : undefined)
                                          }
                                    />
                                    <Select
                                          options={[
                                                { value: '', label: 'All Categories' },
                                                ...CATEGORIES.map((cat) => ({ value: cat, label: cat })),
                                          ]}
                                          value={selectedFilters.category || ''}
                                          onChange={(e) => setCategoryFilter(e.target.value || undefined)}
                                    />
                                    <Select
                                          options={[
                                                { value: 'date', label: 'Sort by Date' },
                                                { value: 'amount', label: 'Sort by Amount' },
                                          ]}
                                          value={sortBy}
                                          onChange={(e) => setSortBy(e.target.value as 'date' | 'amount')}
                                    />
                              </div>

                              {/* Export Buttons */}
                              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                                    <Button
                                          variant="secondary"
                                          size="sm"
                                          icon={<Download size={18} />}
                                          onClick={exportToJSON}
                                          title="Export as JSON"
                                    >
                                          JSON
                                    </Button>
                                    <Button
                                          variant="secondary"
                                          size="sm"
                                          icon={<Download size={18} />}
                                          onClick={exportToCSV}
                                          title="Export as CSV"
                                    >
                                          CSV
                                    </Button>
                              </div>

                              {/* Transactions List */}
                              {sorted.length > 0 ? (
                                    <div style={{ border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`, borderRadius: '0.5rem', overflow: 'hidden', transition: 'all 0.2s ease' }}>
                                          {sorted.map((transaction) => (
                                                <TransactionItem
                                                      key={transaction.id}
                                                      transaction={transaction}
                                                      isAdmin={userRole === 'admin'}
                                                />
                                          ))}
                                    </div>
                              ) : (
                                    <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                                          <p style={{ color: darkMode ? '#9ca3af' : '#6b7280', fontSize: '1.125rem', transition: 'color 0.2s ease' }}>No transactions found</p>
                                    </div>
                              )}
                        </div>
                  </Card>

                  <AddTransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            </>
      );
};
