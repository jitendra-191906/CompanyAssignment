import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Transaction } from '../types/index';
import '../styles/BalanceTrend.css';

interface BalanceTrendProps {
  transactions: Transaction[];
}

export const BalanceTrend: React.FC<BalanceTrendProps> = ({ transactions }) => {
  const sortedTransactions = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const data: { date: string; balance: number }[] = [];
  let balance = 0;

  const uniqueDates = Array.from(new Set(sortedTransactions.map(t => t.date)));
  
  uniqueDates.forEach((date) => {
    const dayTransactions = sortedTransactions.filter(t => t.date === date);
    dayTransactions.forEach((t) => {
      balance += t.type === 'income' ? t.amount : -t.amount;
    });
    data.push({ date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), balance });
  });

  // Limit to last 10 data points for readability
  const displayData = data.slice(-10);

  const peakBalance = Math.max(...displayData.map(d => d.balance), 0);
  const lowBalance = Math.min(...displayData.map(d => d.balance), 0);
  const currentBalance = displayData.length > 0 ? displayData[displayData.length - 1].balance : 0;

  return (
    <div className="balance-trend">
      <div className="balance-trend__header">
        <h2 className="balance-trend__title">Balance Trend</h2>
        <span className="balance-trend__period">Last 10 days</span>
      </div>

      <div className="balance-trend__chart-container">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={displayData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
            <XAxis dataKey="date" stroke="var(--text-secondary)" style={{ fontSize: '12px' }} />
            <YAxis stroke="var(--text-secondary)" style={{ fontSize: '12px' }} />
            <Tooltip
              contentStyle={{ 
                backgroundColor: 'var(--bg-tertiary)',
                border: '1px solid var(--border-color)',
                borderRadius: '0.5rem',
                padding: '0.75rem'
              }}
              formatter={(value: number) => `$${value.toFixed(2)}`}
              // labelFormatter={(label) => label}
            />
            <Bar 
              dataKey="balance" 
              fill="var(--accent-primary)" 
              radius={[2, 2, 0, 0]}
              isAnimationActive={true}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="balance-trend__summary">
        <div className="balance-trend__stat">
          <div className="balance-trend__stat-label">Peak Balance</div>
          <div className="balance-trend__stat-value balance-trend__stat-value--peak">
            ${peakBalance.toFixed(2)}
          </div>
        </div>
        <div className="balance-trend__stat">
          <div className="balance-trend__stat-label">Current Balance</div>
          <div className="balance-trend__stat-value balance-trend__stat-value--current">
            ${currentBalance.toFixed(2)}
          </div>
        </div>
        <div className="balance-trend__stat">
          <div className="balance-trend__stat-label">Low Balance</div>
          <div className="balance-trend__stat-value balance-trend__stat-value--low">
            ${lowBalance.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
};
