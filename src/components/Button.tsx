import React from 'react';
import { useDashboard } from '../context/DashboardContext';
import '../styles/Button.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children?: React.ReactNode;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  icon,
  className,
  ...props
}) => {
  const { darkMode } = useDashboard();

  const classNames = [
    'button',
    `button--${variant}`,
    `button--${size}`,
    className,
  ].filter(Boolean).join(' ');

  return (
    <button
      className={classNames}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
};
