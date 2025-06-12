import React from 'react';

const NavBar = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'attendance', label: 'Attendance' },
    { id: 'register', label: 'Register' },
    { id: 'reports', label: 'Reports' }
  ];

  return (
    <nav>
      <ul>
        {tabs.map(tab => (
          <li key={tab.id}>
            <a 
              href="#" 
              className={activeTab === tab.id ? 'nav-link active' : 'nav-link'}
              onClick={(e) => {
                e.preventDefault();
                setActiveTab(tab.id);
              }}
            >
              {tab.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NavBar;
