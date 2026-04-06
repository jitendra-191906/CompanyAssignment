import React from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { Transaction } from '../types/index';
import { CATEGORIES } from '../types/mockData';
import { useDashboard } from '../context/DashboardContext';
import '../styles/SpendingBreakdown.css';

interface SpendingBreakdownProps {
  transactions: Transaction[];
}

const COLORS = [
  '#10b981',
  '#3b82f6',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#ec4899',
  '#14b8a6',
  '#f97316',
];

export const SpendingBreakdown: React.FC<SpendingBreakdownProps> = ({ transactions }) => {
  const expenses = transactions.filter((t) => t.type === 'expense');

  const spendingByCategory = CATEGORIES.reduce(
    (acc, category) => {
      const amount = expenses
        .filter((t) => t.category === category)
        .reduce((sum, t) => sum + t.amount, 0);
      if (amount > 0) {
        acc.push({ name: category, value: amount });
      }
      return acc;
    },
    [] as { name: string; value: number }[]
  );

  if (spendingByCategory.length === 0) {
    return (
      <div style={{ width: '100%', height: '320px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>
        No spending data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={spendingByCategory}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, value }) => `${name}: $${value.toFixed(0)}`}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
        >
          {spendingByCategory.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};
