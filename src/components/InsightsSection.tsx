import React from 'react';
import { useDashboard } from '../context/DashboardContext';
import { Card } from './Card';
import '../styles/InsightsSection.css';

export const InsightsSection: React.FC = () => {
  const { transactions, darkMode } = useDashboard();

  if (transactions.length === 0) {
    return null;
  }

  // Calculate insights
  const expenses = transactions.filter((t) => t.type === 'expense');
  const income = transactions.filter((t) => t.type === 'income');

  const highestSpendingCategory = expenses.reduce(
    (max, transaction) => {
      const categoryTotal = expenses
        .filter((t) => t.category === transaction.category)
        .reduce((sum, t) => sum + t.amount, 0);
      return categoryTotal > (max.amount || 0)
        ? { category: transaction.category, amount: categoryTotal }
        : max;
    },
    { category: '', amount: 0 }
  );

  // Calculate monthly comparison
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  const currentMonthExpenses = expenses
    .filter((t) => {
      const date = new Date(t.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    })
    .reduce((sum, t) => sum + t.amount, 0);

  const lastMonthExpenses = expenses
    .filter((t) => {
      const date = new Date(t.date);
      return date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear;
    })
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyChange =
    lastMonthExpenses !== 0 ? ((currentMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100 : 0;

  // Average daily spending
  const dateRange = new Set(transactions.map((t) => t.date)).size;
  const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
  const averageDailySpending = dateRange > 0 ? totalExpenses / dateRange : 0;

  // Income vs Expenses ratio
  const totalIncome = income.reduce((sum, t) => sum + t.amount, 0);
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

  const containerStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
  };

  return (
    <Card title="Financial Insights">
      <div style={containerStyle}>
        <InsightBox
          label="Highest Spending"
          value={highestSpendingCategory.category}
          detail={`$${highestSpendingCategory.amount.toFixed(2)}`}
          color="blue"
          darkMode={darkMode}
        />
        <InsightBox
          label="Monthly Change"
          value={monthlyChange.toFixed(1)}
          detail={monthlyChange > 0 ? `▲ ${monthlyChange.toFixed(1)}%` : `▼ ${monthlyChange.toFixed(1)}%`}
          color={monthlyChange > 0 ? 'red' : 'emerald'}
          darkMode={darkMode}
        />
        <InsightBox
          label="Daily Spending"
          value={`$${averageDailySpending.toFixed(2)}`}
          detail="Average per day"
          color="orange"
          darkMode={darkMode}
        />
        <InsightBox
          label="Savings Rate"
          value={savingsRate.toFixed(1)}
          detail={savingsRate >= 0 ? 'of income' : 'over spending'}
          color={savingsRate >= 0 ? 'emerald' : 'red'}
          darkMode={darkMode}
        />
      </div>
    </Card>
  );
};

interface InsightBoxProps {
  label: string;
  value: string | number;
  detail: string;
  color: 'emerald' | 'blue' | 'red' | 'orange';
  darkMode: boolean;
}

const colorBgMap = {
  emerald: '#f0fdf4',
  blue: '#eff6ff',
  red: '#fef2f2',
  orange: '#fff7ed',
};

const colorBgMapDark = {
  emerald: '#064e3b',
  blue: '#0c2d48',
  red: '#4c0519',
  orange: '#5a2e0a',
};

const colorBorderMap = {
  emerald: '#d1fae5',
  blue: '#bfdbfe',
  red: '#fee2e2',
  orange: '#fed7aa',
};

const colorBorderMapDark = {
  emerald: '#047857',
  blue: '#0369a1',
  red: '#7f1d1d',
  orange: '#92400e',
};

const colorTextMap = {
  emerald: '#047857',
  blue: '#1e40af',
  red: '#991b1b',
  orange: '#92400e',
};

const colorTextMapDark = {
  emerald: '#6ee7b7',
  blue: '#60a5fa',
  red: '#f87171',
  orange: '#fb923c',
};

const InsightBox: React.FC<InsightBoxProps> = ({ label, value, detail, color, darkMode }) => {
  const boxStyle: React.CSSProperties = {
    padding: '1rem',
    borderRadius: '0.5rem',
    border: `1px solid ${darkMode ? colorBorderMapDark[color] : colorBorderMap[color]}`,
    backgroundColor: darkMode ? colorBgMapDark[color] : colorBgMap[color],
    transition: 'all 0.2s ease',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '0.875rem',
    fontWeight: 500,
    color: darkMode ? '#9ca3af' : '#4b5563',
    transition: 'color 0.2s ease',
  };

  const valueStyle: React.CSSProperties = {
    fontSize: '1.25rem',
    fontWeight: 700,
    marginTop: '0.25rem',
    color: darkMode ? colorTextMapDark[color] : colorTextMap[color],
    transition: 'color 0.2s ease',
  };

  const detailStyle: React.CSSProperties = {
    fontSize: '0.75rem',
    color: darkMode ? '#6b7280' : '#4b5563',
    marginTop: '0.25rem',
    transition: 'color 0.2s ease',
  };

  return (
    <div style={boxStyle}>
      <p style={labelStyle}>{label}</p>
      <p style={valueStyle}>{value}</p>
      <p style={detailStyle}>{detail}</p>
    </div>
  );
};
