import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';

const Navigation = () => {
  const location = useLocation();

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-brand">
          <Link to="/">App</Link>
        </div>
        <ul className="nav-links">
          <li>
            <Link 
              to="/" 
              className={location.pathname === '/' ? 'active' : ''}
            >
              Home
            </Link>
          </li>
          <li>
            <Link 
              to="/scoreboard" 
              className={location.pathname === '/scoreboard' ? 'active' : ''}
            >
              Scoreboard
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;