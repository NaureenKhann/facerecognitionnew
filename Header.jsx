import React, { useState, useRef, useEffect } from 'react';
import { 
  Search,
  Bell,
  HelpCircle,
  Settings,
  User,
  Mail,
  Calendar,
  Clock,
  ChevronDown,
  LogOut,
  Moon,
  Sun,
  Menu,
  X
} from 'lucide-react';
import '../../styles/Header.css';

const Header = ({ title, sidebarCollapsed, onToggleSidebar }) => {
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New Student Registration', message: '5 new students registered', time: '10 min ago', read: false, type: 'info' },
    { id: 2, title: 'System Update Available', message: 'Version 2.1.0 is ready', time: '1 hour ago', read: false, type: 'warning' },
    { id: 3, title: 'Attendance Alert', message: 'Low attendance in CS Branch', time: '2 hours ago', read: true, type: 'alert' },
    { id: 4, title: 'Backup Completed', message: 'Daily backup successful', time: 'Yesterday', read: true, type: 'success' },
  ]);

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  const userMenuRef = useRef(null);
  const notificationsRef = useRef(null);
  const searchRef = useRef(null);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target) && searchQuery === '') {
        setSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [searchQuery]);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleNotificationClick = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const handleLogout = () => {
    // Handle logout logic
    console.log('Logout clicked');
    // In production: localStorage.clear(); window.location.href = '/login';
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
      // Navigate to search results or perform search
      setSearchQuery('');
      setSearchOpen(false);
    }
  };

  const handleSearchSuggestion = (suggestion) => {
    setSearchQuery(suggestion);
    // Perform search or navigate
    console.log('Selected suggestion:', suggestion);
  };

  const quickActions = [
    { icon: Calendar, label: 'Today\'s Schedule', path: '/admin/timetable' },
    { icon: User, label: 'Add New Student', path: '/admin/students/new' },
    { icon: Settings, label: 'System Settings', path: '/admin/settings' },
    { icon: Mail, label: 'Messages', path: '/admin/messages' },
  ];

  // Get current hour for greeting
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good Morning' : 
                   currentHour < 18 ? 'Good Afternoon' : 
                   'Good Evening';

  return (
    <header className="admin-header">
      {/* Left Section - Reduced icon sizes and optimized */}
      <div className="header-left">
        <button 
          className="sidebar-toggle"
          onClick={onToggleSidebar}
          aria-label={sidebarCollapsed ? 'Open sidebar' : 'Close sidebar'}
        >
          {sidebarCollapsed ? <Menu size={20} /> : <X size={20} />}
        </button>

        <div className="page-info">
          <h1 className="page-title">{title}</h1>
          <div className="page-subtitle">
            <Clock size={14} />
            <span>{formatTime(currentTime)} • {greeting}</span>
          </div>
        </div>
      </div>

      {/* Center Section - Search - Simplified */}
      <div className="header-center" ref={searchRef}>
        <div className={`search-container ${searchOpen ? 'expanded' : ''}`}>
          <form onSubmit={handleSearch} className="search-form">
            <button 
              type="button" 
              className="search-toggle"
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Search"
            >
              <Search size={18} />
            </button>
            <input
              type="text"
              className="search-input"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchOpen(true)}
            />
            {searchQuery && (
              <button 
                type="button"
                className="clear-search"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </form>
          
          {searchOpen && (
            <div className="search-results">
              <div className="search-results-header">
                <h4>Quick Results</h4>
                <button 
                  className="view-all-search"
                  onClick={() => console.log('View all search results')}
                >
                  View All
                </button>
              </div>
              <div className="search-suggestions">
                <button 
                  className="suggestion"
                  onClick={() => handleSearchSuggestion('John Doe')}
                >
                  Students: John Doe
                </button>
                <button 
                  className="suggestion"
                  onClick={() => handleSearchSuggestion('Dr. Smith')}
                >
                  Teacher: Dr. Smith
                </button>
                <button 
                  className="suggestion"
                  onClick={() => handleSearchSuggestion('Mathematics')}
                >
                  Subject: Mathematics
                </button>
                <button 
                  className="suggestion"
                  onClick={() => handleSearchSuggestion('Attendance Report')}
                >
                  Report: Attendance
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Section - Optimized icons and layout */}
      <div className="header-right">
        {/* Quick Actions - Smaller icons */}
        <div className="quick-actions">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button 
                key={index}
                className="quick-action-btn"
                onClick={() => console.log('Navigate to:', action.path)}
                aria-label={action.label}
                title={action.label}
              >
                <Icon size={18} />
              </button>
            );
          })}
        </div>

        {/* Theme Toggle - Smaller */}
        <button 
          className="theme-toggle"
          onClick={() => setDarkMode(!darkMode)}
          aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          title={darkMode ? 'Light Mode' : 'Dark Mode'}
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Help - Smaller */}
        <button 
          className="help-btn"
          aria-label="Help"
          title="Help & Support"
          onClick={() => console.log('Open help')}
        >
          <HelpCircle size={18} />
        </button>

        {/* Notifications - Smaller */}
        <div className="notifications-container" ref={notificationsRef}>
          <button 
            className="notifications-btn"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            aria-label="Notifications"
            title="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="notification-badge">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {notificationsOpen && (
            <div className="notifications-dropdown">
              <div className="notifications-header">
                <h3>Notifications</h3>
                {unreadCount > 0 && (
                  <button 
                    className="mark-all-read"
                    onClick={handleMarkAllAsRead}
                  >
                    Mark all as read
                  </button>
                )}
              </div>
              
              <div className="notifications-list">
                {notifications.map(notification => (
                  <div 
                    key={notification.id}
                    className={`notification-item ${notification.read ? 'read' : 'unread'} ${notification.type}`}
                    onClick={() => handleNotificationClick(notification.id)}
                  >
                    <div className="notification-icon">
                      {notification.type === 'info' && <Bell size={14} />}
                      {notification.type === 'warning' && <HelpCircle size={14} />}
                      {notification.type === 'alert' && <HelpCircle size={14} />}
                      {notification.type === 'success' && <Bell size={14} />}
                    </div>
                    <div className="notification-content">
                      <h4>{notification.title}</h4>
                      <p>{notification.message}</p>
                      <span className="notification-time">{notification.time}</span>
                    </div>
                    {!notification.read && (
                      <div className="unread-indicator"></div>
                    )}
                  </div>
                ))}
              </div>

              <div className="notifications-footer">
                <button 
                  className="view-all-notifications"
                  onClick={() => console.log('View all notifications')}
                >
                  View All Notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Menu - More compact */}
        <div className="user-menu-container" ref={userMenuRef}>
          <button 
            className="user-menu-btn"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            aria-label="User menu"
          >
            <div className="user-avatar">
              <span className="avatar-text">AD</span>
            </div>
            <span className="user-name">Admin</span>
            <ChevronDown size={14} />
          </button>

          {userMenuOpen && (
            <div className="user-menu-dropdown">
              <div className="user-info-section">
                <div className="user-avatar-large">
                  <span className="avatar-text">AD</span>
                </div>
                <div className="user-details">
                  <h4>Administrator</h4>
                  <p>admin@college.edu</p>
                  <span className="user-role">Super Admin</span>
                </div>
              </div>

              <div className="user-menu-items">
                <button 
                  className="menu-item"
                  onClick={() => console.log('Navigate to profile')}
                >
                  <User size={16} />
                  <span>My Profile</span>
                </button>
                <button 
                  className="menu-item"
                  onClick={() => console.log('Navigate to settings')}
                >
                  <Settings size={16} />
                  <span>Account Settings</span>
                </button>
                <button 
                  className="menu-item"
                  onClick={() => console.log('Open help')}
                >
                  <HelpCircle size={16} />
                  <span>Help & Support</span>
                </button>
              </div>

              <div className="user-menu-footer">
                <button className="logout-menu-item" onClick={handleLogout}>
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;