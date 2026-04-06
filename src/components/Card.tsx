import React from 'react';
import { useDashboard } from '../context/DashboardContext';
import '../styles/Card.css';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  headerAction?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ title, children, className, headerAction }) => {
  const { darkMode } = useDashboard();

  return (
    <div className={`card ${className || ''}`}>
      {(title || headerAction) && (
        <div className="card__header">
          {title && <h3 className="card__header-title">{title}</h3>}
          {headerAction && <div className="card__header-actions">{headerAction}</div>}
        </div>
      )}
      <div className="card__body">
        {children}
      </div>
    </div>
  );
};
