import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import '../styles/StatCard.css';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: number;
  color: 'emerald' | 'blue' | 'red' | 'purple' | 'orange';
  description?: string;
}

const colorMap = {
  emerald: 'stat-card__icon',
  blue: 'stat-card__icon--secondary',
  red: 'stat-card__icon--warning',
  purple: 'stat-card__icon--danger',
  orange: 'stat-card__icon--secondary',
};

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  color,
  description,
}) => {
  const { darkMode } = useDashboard();

  const iconClass = colorMap[color] || 'stat-card__icon';

  return (
    <div className="stat-card">
      <div className="stat-card__container">
        <div className="stat-card__content">
          <div className="stat-card__label">{title}</div>
          <div className="stat-card__value">{value}</div>
          {description && <div className="stat-card__subtext">{description}</div>}
          {trend !== undefined && (
            <div className={`stat-card__trend stat-card__trend--${trend >= 0 ? 'up' : 'down'}`}>
              {trend >= 0 ? (
                <TrendingUp size={16} className="stat-card__trend-icon" />
              ) : (
                <TrendingDown size={16} className="stat-card__trend-icon" />
              )}
              <span>{trend >= 0 ? '+' : ''}{trend.toFixed(1)}%</span>
            </div>
          )}
        </div>
        <div className={iconClass}>
          {icon}
        </div>
      </div>
    </div>
  );
};
