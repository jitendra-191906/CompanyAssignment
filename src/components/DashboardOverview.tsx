import React from 'react';
import { DollarSign, TrendingUp, TrendingDown, PieChart } from 'lucide-react';
import { StatCard } from './StatCard';
import { Card } from './Card';
import { BalanceTrend } from './BalanceTrend';
import { SpendingBreakdown } from './SpendingBreakdown';
import { useDashboard } from '../context/DashboardContext';
import '../styles/DashboardOverview.css';

export const DashboardOverview: React.FC = () => {
  const { transactions } = useDashboard();

  // Calculate totals
  const income = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = income - expenses;

  // Calculate trend (compare this month to last month)
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  const currentMonthIncome = transactions
    .filter((t) => {
      const date = new Date(t.date);
      return t.type === 'income' && date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    })
    .reduce((sum, t) => sum + t.amount, 0);

  const lastMonthIncome = transactions
    .filter((t) => {
      const date = new Date(t.date);
      return t.type === 'income' && date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear;
    })
    .reduce((sum, t) => sum + t.amount, 0);

  const currentMonthExpenses = transactions
    .filter((t) => {
      const date = new Date(t.date);
      return t.type === 'expense' && date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    })
    .reduce((sum, t) => sum + t.amount, 0);

  const lastMonthExpenses = transactions
    .filter((t) => {
      const date = new Date(t.date);
      return t.type === 'expense' && date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear;
    })
    .reduce((sum, t) => sum + t.amount, 0);

  const incomeTrend =
    lastMonthIncome !== 0 ? ((currentMonthIncome - lastMonthIncome) / lastMonthIncome) * 100 : 0;
  const expenseTrend =
    lastMonthExpenses !== 0 ? ((currentMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100 : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        <StatCard
          title="Total Balance"
          value={`$${balance.toFixed(2)}`}
          icon={<DollarSign size={24} />}
          color="emerald"
          description={balance >= 0 ? 'Healthy balance' : 'Deficit'}
          trend={0}
        />
        <StatCard
          title="Total Income"
          value={`$${income.toFixed(2)}`}
          icon={<TrendingUp size={24} />}
          color="blue"
          description={`This month: $${currentMonthIncome.toFixed(2)}`}
          trend={incomeTrend}
        />
        <StatCard
          title="Total Expenses"
          value={`$${expenses.toFixed(2)}`}
          icon={<TrendingDown size={24} />}
          color="red"
          description={`This month: $${currentMonthExpenses.toFixed(2)}`}
          trend={expenseTrend}
        />
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
        <Card title="Balance Trend">
          <BalanceTrend transactions={transactions} />
        </Card>

        <Card title="Spending Breakdown">
          <SpendingBreakdown transactions={transactions} />
        </Card>
      </div>
    </div>
  );
};
