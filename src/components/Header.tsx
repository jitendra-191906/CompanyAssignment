import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from './Button';
import { Select } from './Select';
import { useDashboard } from '../context/DashboardContext';
import { UserRole } from '../types/index';
import '../styles/Header.css';

export const Header: React.FC = () => {
  const { userRole, setUserRole, darkMode, toggleDarkMode } = useDashboard();

  return (
    <header className="header">
      <div className="header__container">
        <div className="header__logo-section">
          <div className="header__logo-icon">💰</div>
          <h1 className="header__title">Finance</h1>
        </div>

        <div className="header__controls">
          <div className="header__role-section">
            <span className="header__role-label">Role:</span>
            <Select
              options={[
                { value: 'viewer', label: 'Viewer' },
                { value: 'admin', label: 'Admin' },
              ]}
              value={userRole}
              onChange={(e) => setUserRole(e.target.value as UserRole)}
            />
          </div>

          <div className="header__divider" />
          <Button
            variant="outline"
            size="sm"
            onClick={toggleDarkMode}
            icon={darkMode ? <Sun size={18} /> : <Moon size={18} />}
            title={darkMode ? 'Light Mode' : 'Dark Mode'}/>
        </div>
      </div>
    </header>
  );
};
