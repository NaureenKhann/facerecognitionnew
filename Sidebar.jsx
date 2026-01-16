import React, { useState } from 'react';
import { 
  NavLink,
  useLocation
} from 'react-router-dom';
import { 
  LayoutDashboard,
  Users,
  UserCog,
  BookOpen,
  Calendar,
  Settings,
  BarChart3,
  FileText,
  Shield,
  Database,
  Bell,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Home,
  Clock,
  AlertCircle
} from 'lucide-react';
import '../../styles/Sidebar.css';


const Sidebar = ({ collapsed, onToggle }) => {
  const location = useLocation();
  
  const mainNavItems = [
    { 
      icon: LayoutDashboard, 
      label: 'Dashboard', 
      path: '/admin/dashboard',
      badge: null
    },
    { 
      icon: Users, 
      label: 'Students', 
      path: '/admin/students',
      badge: null
    },
    { 
      icon: UserCog, 
      label: 'Teachers', 
      path: '/admin/teachers',  
      badge: null
    },
    { 
      icon: BookOpen, 
      label: 'Subjects', 
      path: '/admin/subject',
      badge: null
    },
    { 
      icon: Calendar, 
      label: 'Timetable', 
      path: '/admin/timetable',
      badge: null
    },
  ];

  const systemNavItems = [
    { 
      icon: FileText, 
      label: 'Reports', 
      path: '/admin/reports',
      badge: null
    },
    { 
      icon: Settings, 
      label: 'System Settings', 
      path: '/admin/settings',
      badge: null
    },
  ];

  const quickAccessItems = [
    { 
      icon: Bell, 
      label: 'Notifications', 
      path: '/admin/notification',
      badge: '5'
    },
  ];

  const NavItem = ({ item }) => {
    const Icon = item.icon;
    const isActive = location.pathname === item.path || 
                     location.pathname.startsWith(item.path + '/');
    
    return (
      <li className="nav-item">
        <NavLink 
          to={item.path} 
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <div className="nav-icon">
            <Icon size={20} />
            {item.badge && (
              <span className="nav-badge">{item.badge}</span>
            )}
          </div>
          {!collapsed && (
            <>
              <span className="nav-label">{item.label}</span>
              {isActive && <div className="active-indicator"></div>}
            </>
          )}
        </NavLink>
      </li>
    );
  };

  return (
    <aside className={`admin-sidebar ${collapsed ? 'collapsed' : ''}`}>
      {/* Logo Section */}
      <div className="sidebar-header">
        <div className="logo-container">
          <div className="logo-icon">🎓</div>
          {!collapsed && (
            <div className="logo-text">
              <h2>Smart Attendance</h2>
              <span className="admin-badge">Admin Panel</span>
            </div>
          )}
        </div>
        
        <button 
          className="toggle-btn"
          onClick={onToggle}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Navigation Sections */}
      <div className="sidebar-content">
        {/* Quick Access */}
        <div className="nav-section">
          <div className="nav-section-header">
            {!collapsed && <h3 className="section-title">QUICK ACCESS</h3>}
          </div>
          <ul className="nav-list">
            <li className="nav-item">
              <NavLink to="/" className="nav-link">
                <div className="nav-icon">
                  <Home size={20} />
                </div>
                {!collapsed && <span className="nav-label">Back to Home</span>}
              </NavLink>
            </li>
            {quickAccessItems.map((item, index) => (
              <NavItem key={`quick-${index}`} item={item} />
            ))}
          </ul>
        </div>

        {/* Main Navigation */}
        <div className="nav-section">
          <div className="nav-section-header">
            {!collapsed && <h3 className="section-title">MAIN NAVIGATION</h3>}
          </div>
          <ul className="nav-list">
            {mainNavItems.map((item, index) => (
              <NavItem key={`main-${index}`} item={item} />
            ))}
          </ul>
        </div>

        {/* System */}
        <div className="nav-section">
          <div className="nav-section-header">
            {!collapsed && <h3 className="section-title">SYSTEM</h3>}
          </div>
          <ul className="nav-list">
            {systemNavItems.map((item, index) => (
              <NavItem key={`system-${index}`} item={item} />
            ))}
          </ul>
        </div>

        {/* Support Section */}
        <div className="nav-section support-section">
          {!collapsed && (
            <div className="support-card">
              <div className="support-icon">
                <HelpCircle size={24} />
              </div>
              <div className="support-content">
                <h4>Need Help?</h4>
                <p>Check our documentation or contact support</p>
                <button className="support-btn">Get Help</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* User Profile & Logout */}
      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="user-avatar">
            <span className="avatar-text">AD</span>
          </div>
          {!collapsed && (
            <div className="user-info">
              <h4 className="user-name">Administrator</h4>
              <p className="user-email">admin@college.edu</p>
            </div>
          )}
        </div>
        
        <button className="logout-btn">
          <LogOut size={20} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;