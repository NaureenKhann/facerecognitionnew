import React, { useState, useEffect } from 'react';
import './Notification.css';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

const Notification = () => {
  // State for notifications
  const [notifications, setNotifications] = useState(() => {
    const storedNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    if (storedNotifications.length > 0) {
      return storedNotifications;
    }
    // Mock notifications if none exist
    return [
      {
        id: 1,
        title: 'Low Attendance Alert',
        message: 'Attendance for FY students is below 75%. Please ensure regular attendance.',
        audience: { type: 'year', value: 'FY' },
        type: 'attendance_alert',
        status: 'sent',
        createdAt: '2024-01-15T10:30:00',
        sentAt: '2024-01-15T10:30:00',
        readCount: 45
      },
      {
        id: 2,
        title: 'Faculty Meeting Reminder',
        message: 'Monthly faculty meeting scheduled for Friday at 3 PM in Conference Room A.',
        audience: { type: 'teachers', value: 'All Teachers' },
        type: 'meeting',
        status: 'sent',
        createdAt: '2024-01-14T14:00:00',
        sentAt: '2024-01-14T14:00:00',
        readCount: 28
      },
      {
        id: 3,
        title: 'Semester Exam Schedule',
        message: 'The semester exam schedule has been published. Please check the notice board.',
        audience: { type: 'students', value: 'All Students' },
        type: 'exam',
        status: 'sent',
        createdAt: '2024-01-13T09:15:00',
        sentAt: '2024-01-13T09:15:00',
        readCount: 156
      },
      {
        id: 4,
        title: 'Holiday Announcement',
        message: 'College will remain closed on 26th January for Republic Day.',
        audience: { type: 'all', value: 'All Users' },
        type: 'holiday',
        status: 'draft',
        createdAt: '2024-01-16T11:00:00',
        sentAt: null,
        readCount: 0
      },
      {
        id: 5,
        title: 'Library Book Return',
        message: 'Last date for returning library books is 31st January.',
        audience: { type: 'students', value: 'All Students' },
        type: 'library',
        status: 'draft',
        createdAt: '2024-01-16T09:00:00',
        sentAt: null,
        readCount: 0
      }
    ];
  });
  
  // State for new notification
  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    audienceType: 'all',
    audienceValue: 'all',
    type: 'general'
  });
  
  // State for filters
  const [filters, setFilters] = useState({
    status: 'all',
    audience: 'all',
    type: 'all'
  });
  
  // State for search
  const [searchTerm, setSearchTerm] = useState('');
  
  // State for low attendance alert
  const [showAttendanceAlert, setShowAttendanceAlert] = useState(false);
  const [attendanceData, setAttendanceData] = useState([]);
  
  // Filtered notifications
  const filteredNotifications = notifications.filter(notification => {
    // Filter by status
    if (filters.status !== 'all' && notification.status !== filters.status) {
      return false;
    }
    
    // Filter by audience
    if (filters.audience !== 'all' && notification.audience.type !== filters.audience) {
      return false;
    }
    
    // Filter by type
    if (filters.type !== 'all' && notification.type !== filters.type) {
      return false;
    }
    
    // Filter by search term
    if (searchTerm && !notification.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !notification.message.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  // Years for audience selection
  const years = ['FY', 'SY', 'TY', 'FTY'];
  
  // Notification types
  const notificationTypes = [
    { id: 'general', label: 'General', icon: '📢' },
    { id: 'attendance_alert', label: 'Attendance Alert', icon: '⚠️' },
    { id: 'exam', label: 'Exam', icon: '📝' },
    { id: 'meeting', label: 'Meeting', icon: '👥' },
    { id: 'holiday', label: 'Holiday', icon: '🎉' },
    { id: 'library', label: 'Library', icon: '📚' },
    { id: 'fee', label: 'Fee', icon: '💰' },
    { id: 'event', label: 'Event', icon: '🎪' }
  ];
  
  // Load students for attendance check
  useEffect(() => {
    const storedStudents = JSON.parse(localStorage.getItem('students') || '[]');
    if (storedStudents.length > 0) {
      // Mock attendance data
      const attendance = storedStudents.map(student => ({
        id: student.id,
        name: student.name,
        year: getYearFromStudent(student),
        attendance: student.attendance || Math.floor(Math.random() * 100),
        status: 'pending'
      }));
      setAttendanceData(attendance);
    } else {
      // Mock data if no students exist
      const mockAttendance = [
        { id: 1, name: 'John Doe', year: 'SY', attendance: 65, status: 'low' },
        { id: 2, name: 'Jane Smith', year: 'TY', attendance: 78, status: 'ok' },
        { id: 3, name: 'Alex Johnson', year: 'FY', attendance: 45, status: 'low' },
        { id: 4, name: 'Maria Garcia', year: 'SY', attendance: 82, status: 'ok' },
        { id: 5, name: 'Sam Wilson', year: 'FY', attendance: 58, status: 'low' }
      ];
      setAttendanceData(mockAttendance);
    }
  }, []);
  
  // Helper function to get year from student
  const getYearFromStudent = (student) => {
    if (student.semester <= 2) return 'FY';
    if (student.semester <= 4) return 'SY';
    if (student.semester <= 6) return 'TY';
    return 'FTY';
  };
  
  // Save notifications to localStorage
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);
  
  // Handle creating new notification
  const handleCreateNotification = (e) => {
    e.preventDefault();
    
    if (!newNotification.title || !newNotification.message) {
      alert('Please fill in title and message');
      return;
    }
    
    const notification = {
      id: Date.now(),
      title: newNotification.title,
      message: newNotification.message,
      audience: {
        type: newNotification.audienceType,
        value: newNotification.audienceType === 'year' ? newNotification.audienceValue : newNotification.audienceType
      },
      type: newNotification.type,
      status: 'draft',
      createdAt: new Date().toISOString(),
      sentAt: null,
      readCount: 0
    };
    
    setNotifications([...notifications, notification]);
    
    // Reset form
    setNewNotification({
      title: '',
      message: '',
      audienceType: 'all',
      audienceValue: 'FY',
      type: 'general'
    });
    
    alert('Notification saved as draft!');
  };
  
  // Handle sending notification
  const handleSendNotification = (notificationId) => {
    if (window.confirm('Send this notification?')) {
      const updatedNotifications = notifications.map(notification => {
        if (notification.id === notificationId) {
          return {
            ...notification,
            status: 'sent',
            sentAt: new Date().toISOString(),
            readCount: 0 // Reset read count when sent
          };
        }
        return notification;
      });
      
      setNotifications(updatedNotifications);
      alert('Notification sent successfully!');
    }
  };
  
  // Handle editing notification
  const handleEditNotification = (notification) => {
    if (notification.status === 'sent') {
      alert('Cannot edit sent notifications. Create a new one instead.');
      return;
    }
    
    const newTitle = prompt('Edit title:', notification.title);
    const newMessage = prompt('Edit message:', notification.message);
    
    if (newTitle !== null && newMessage !== null) {
      const updatedNotifications = notifications.map(n => {
        if (n.id === notification.id) {
          return {
            ...n,
            title: newTitle,
            message: newMessage
          };
        }
        return n;
      });
      
      setNotifications(updatedNotifications);
      alert('Notification updated!');
    }
  };
  
  // Handle deleting notification
  const handleDeleteNotification = (notificationId) => {
    if (window.confirm('Delete this notification?')) {
      const updatedNotifications = notifications.filter(n => n.id !== notificationId);
      setNotifications(updatedNotifications);
      alert('Notification deleted!');
    }
  };
  
  // Handle sending directly from form
  const handleSendNow = (e) => {
    e.preventDefault();
    
    if (!newNotification.title || !newNotification.message) {
      alert('Please fill in title and message');
      return;
    }
    
    if (window.confirm('Send this notification now?')) {
      const notification = {
        id: Date.now(),
        title: newNotification.title,
        message: newNotification.message,
        audience: {
          type: newNotification.audienceType,
          value: newNotification.audienceType === 'year' ? newNotification.audienceValue : newNotification.audienceType
        },
        type: newNotification.type,
        status: 'sent',
        createdAt: new Date().toISOString(),
        sentAt: new Date().toISOString(),
        readCount: 0
      };
      
      setNotifications([...notifications, notification]);
      
      // Reset form
      setNewNotification({
        title: '',
        message: '',
        audienceType: 'all',
        audienceValue: 'FY',
        type: 'general'
      });
      
      alert('Notification sent successfully!');
    }
  };
  
  // Handle low attendance alert
  const handleSendAttendanceAlert = () => {
    const lowAttendanceStudents = attendanceData.filter(student => student.attendance < 75);
    
    if (lowAttendanceStudents.length === 0) {
      alert('No students with low attendance found.');
      return;
    }
    
    // Group by year
    const yearGroups = {};
    lowAttendanceStudents.forEach(student => {
      if (!yearGroups[student.year]) {
        yearGroups[student.year] = [];
      }
      yearGroups[student.year].push(student);
    });
    
    // Send separate alerts for each year
    Object.keys(yearGroups).forEach(year => {
      const students = yearGroups[year];
      const notification = {
        id: Date.now() + Math.random(),
        title: `Low Attendance Alert - ${year}`,
        message: `${students.length} students in ${year} have attendance below 75%. Please ensure regular attendance.`,
        audience: { type: 'year', value: year },
        type: 'attendance_alert',
        status: 'sent',
        createdAt: new Date().toISOString(),
        sentAt: new Date().toISOString(),
        readCount: 0
      };
      
      setNotifications(prev => [...prev, notification]);
    });
    
    setShowAttendanceAlert(false);
    alert(`Attendance alerts sent for ${Object.keys(yearGroups).length} year(s)!`);
  };
  
  // Calculate notification stats
  const notificationStats = {
    total: notifications.length,
    sent: notifications.filter(n => n.status === 'sent').length,
    drafts: notifications.filter(n => n.status === 'draft').length,
    readCount: notifications.reduce((sum, n) => sum + n.readCount, 0)
  };
  
  // Get audience display text
  const getAudienceText = (audience) => {
    switch (audience.type) {
      case 'all': return 'All Users';
      case 'students': return 'All Students';
      case 'teachers': return 'All Teachers';
      case 'year': return `${audience.value} Students`;
      default: return 'Unknown';
    }
  };
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Not sent';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <div className="notifications-container">
      {/* Header */}
      <Header />
      <Sidebar />
      <div className="notifications-header">
        <h1>Notifications Management</h1>
        <div className="header-actions">
          <button 
            className="btn btn-warning"
            onClick={() => setShowAttendanceAlert(true)}
          >
            ⚠️ Send Attendance Alert
          </button>
        </div>
      </div>
      
      {/* Quick Stats */}
      <div className="notification-stats">
        <div className="stat-card">
          <div className="stat-icon">📨</div>
          <div className="stat-content">
            <div className="stat-number">{notificationStats.total}</div>
            <div className="stat-label">Total Notifications</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📤</div>
          <div className="stat-content">
            <div className="stat-number">{notificationStats.sent}</div>
            <div className="stat-label">Sent</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-content">
            <div className="stat-number">{notificationStats.drafts}</div>
            <div className="stat-label">Drafts</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👁️</div>
          <div className="stat-content">
            <div className="stat-number">{notificationStats.readCount}</div>
            <div className="stat-label">Total Reads</div>
          </div>
        </div>
      </div>
      
      {/* Create New Notification Form */}
      <div className="create-notification-form">
        <h2>Create New Notification</h2>
        <form onSubmit={handleCreateNotification}>
          <div className="form-grid">
            <div className="form-group">
              <label>Title *</label>
              <input
                type="text"
                value={newNotification.title}
                onChange={(e) => setNewNotification({...newNotification, title: e.target.value})}
                placeholder="Enter notification title"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Type</label>
              <select
                value={newNotification.type}
                onChange={(e) => setNewNotification({...newNotification, type: e.target.value})}
              >
                {notificationTypes.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.icon} {type.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Audience</label>
              <select
                value={newNotification.audienceType}
                onChange={(e) => setNewNotification({...newNotification, audienceType: e.target.value})}
              >
                <option value="all">All Users</option>
                <option value="students">All Students</option>
                <option value="teachers">All Teachers</option>
                <option value="year">Specific Year</option>
              </select>
            </div>
            
            {newNotification.audienceType === 'year' && (
              <div className="form-group">
                <label>Select Year</label>
                <select
                  value={newNotification.audienceValue}
                  onChange={(e) => setNewNotification({...newNotification, audienceValue: e.target.value})}
                >
                  {years.map(year => (
                    <option key={year} value={year}>{year} Students</option>
                  ))}
                </select>
              </div>
            )}
          </div>
          
          <div className="form-group">
            <label>Message *</label>
            <textarea
              value={newNotification.message}
              onChange={(e) => setNewNotification({...newNotification, message: e.target.value})}
              placeholder="Enter notification message..."
              rows="4"
              required
            />
            <div className="char-count">{newNotification.message.length}/500 characters</div>
          </div>
          
          <div className="form-actions">
            <button type="submit" className="btn btn-secondary">
              💾 Save as Draft
            </button>
            <button 
              type="button" 
              className="btn btn-primary"
              onClick={handleSendNow}
            >
              📤 Send Now
            </button>
            <button 
              type="button" 
              className="btn btn-outline"
              onClick={() => setNewNotification({
                title: '',
                message: '',
                audienceType: 'all',
                audienceValue: 'FY',
                type: 'general'
              })}
            >
              🔄 Clear
            </button>
          </div>
        </form>
      </div>
      
      {/* Search and Filters */}
      <div className="search-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search notifications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button 
              className="clear-search"
              onClick={() => setSearchTerm('')}
            >
              ✕
            </button>
          )}
        </div>
        
        <div className="filter-controls">
          <select
            value={filters.status}
            onChange={(e) => setFilters({...filters, status: e.target.value})}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="sent">Sent Only</option>
            <option value="draft">Drafts Only</option>
          </select>
          
          <select
            value={filters.audience}
            onChange={(e) => setFilters({...filters, audience: e.target.value})}
            className="filter-select"
          >
            <option value="all">All Audience</option>
            <option value="all">All Users</option>
            <option value="students">Students</option>
            <option value="teachers">Teachers</option>
            <option value="year">Year-wise</option>
          </select>
          
          <select
            value={filters.type}
            onChange={(e) => setFilters({...filters, type: e.target.value})}
            className="filter-select"
          >
            <option value="all">All Types</option>
            {notificationTypes.map(type => (
              <option key={type.id} value={type.id}>{type.label}</option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Notifications List */}
      <div className="notifications-list">
        <h2>
          Notifications ({filteredNotifications.length})
          <span className="filter-info">
            {filters.status !== 'all' && ` • ${filters.status}`}
            {filters.audience !== 'all' && ` • ${filters.audience}`}
            {searchTerm && ` • Search: "${searchTerm}"`}
          </span>
        </h2>
        
        {filteredNotifications.length === 0 ? (
          <div className="empty-state">
            <p>No notifications found. {searchTerm ? 'Try a different search.' : 'Create your first notification above.'}</p>
          </div>
        ) : (
          <div className="notifications-grid">
            {filteredNotifications.map(notification => {
              const typeConfig = notificationTypes.find(t => t.id === notification.type) || notificationTypes[0];
              
              return (
                <div key={notification.id} className={`notification-card ${notification.status}`}>
                  <div className="notification-header">
                    <div className="notification-type">
                      <span className="type-icon">{typeConfig.icon}</span>
                      <span className="type-label">{typeConfig.label}</span>
                    </div>
                    <div className={`status-badge ${notification.status}`}>
                      {notification.status === 'sent' ? '📤 Sent' : '📝 Draft'}
                    </div>
                  </div>
                  
                  <div className="notification-content">
                    <h3 className="notification-title">{notification.title}</h3>
                    <p className="notification-message">{notification.message}</p>
                    
                    <div className="notification-meta">
                      <div className="meta-item">
                        <span className="meta-label">Audience:</span>
                        <span className="meta-value">{getAudienceText(notification.audience)}</span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-label">Created:</span>
                        <span className="meta-value">{formatDate(notification.createdAt)}</span>
                      </div>
                      {notification.status === 'sent' && (
                        <>
                          <div className="meta-item">
                            <span className="meta-label">Sent:</span>
                            <span className="meta-value">{formatDate(notification.sentAt)}</span>
                          </div>
                          <div className="meta-item">
                            <span className="meta-label">Reads:</span>
                            <span className="meta-value">{notification.readCount}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="notification-actions">
                    {notification.status === 'draft' ? (
                      <>
                        <button 
                          className="btn-action send"
                          onClick={() => handleSendNotification(notification.id)}
                        >
                          📤 Send
                        </button>
                        <button 
                          className="btn-action edit"
                          onClick={() => handleEditNotification(notification)}
                        >
                          ✏️ Edit
                        </button>
                      </>
                    ) : (
                      <button 
                        className="btn-action preview"
                        onClick={() => alert(`Preview:\n\n${notification.title}\n\n${notification.message}\n\nTo: ${getAudienceText(notification.audience)}\nRead by: ${notification.readCount} users`)}
                      >
                        👁️ Preview
                      </button>
                    )}
                    <button 
                      className="btn-action delete"
                      onClick={() => handleDeleteNotification(notification.id)}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Low Attendance Alert Modal */}
      {showAttendanceAlert && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Send Attendance Alert</h2>
              <button 
                onClick={() => setShowAttendanceAlert(false)}
                className="modal-close"
              >
                ✕
              </button>
            </div>
            
            <div className="modal-body">
              <div className="alert-info">
                <p>Send attendance alerts to students with low attendance (&lt;75%).</p>
                
                <div className="attendance-summary">
                  <h4>Low Attendance Summary</h4>
                  <div className="summary-cards">
                    {['FY', 'SY', 'TY', 'FTY'].map(year => {
                      const lowAttendance = attendanceData.filter(
                        student => student.year === year && student.attendance < 75
                      );
                      return (
                        <div key={year} className="summary-card">
                          <div className="year">{year}</div>
                          <div className={`count ${lowAttendance.length > 0 ? 'high' : 'low'}`}>
                            {lowAttendance.length} students
                          </div>
                          <div className="percentage">
                            Avg: {lowAttendance.length > 0 
                              ? Math.round(lowAttendance.reduce((sum, s) => sum + s.attendance, 0) / lowAttendance.length)
                              : 0}%
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <div className="attendance-details">
                  <h4>Students with Low Attendance (&lt;75%)</h4>
                  {attendanceData.filter(s => s.attendance < 75).length === 0 ? (
                    <p className="no-low-attendance">🎉 All students have good attendance!</p>
                  ) : (
                    <div className="students-list">
                      {attendanceData
                        .filter(student => student.attendance < 75)
                        .sort((a, b) => a.attendance - b.attendance)
                        .map(student => (
                          <div key={student.id} className="student-item">
                            <span className="student-name">{student.name}</span>
                            <span className="student-year">{student.year}</span>
                            <span className={`attendance-value ${student.attendance < 50 ? 'very-low' : 'low'}`}>
                              {student.attendance}%
                            </span>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
                
                <div className="alert-message-preview">
                  <h4>Alert Message Preview:</h4>
                  <div className="message-preview">
                    <strong>Low Attendance Alert</strong>
                    <p>
                      {attendanceData.filter(s => s.attendance < 75).length} students have attendance below 75%. 
                      Please ensure regular attendance to avoid detention.
                    </p>
                    <small>This alert will be sent to affected years separately.</small>
                  </div>
                </div>
              </div>
              
              <div className="modal-actions">
                <button 
                  className="btn btn-warning"
                  onClick={handleSendAttendanceAlert}
                  disabled={attendanceData.filter(s => s.attendance < 75).length === 0}
                >
                  ⚠️ Send Attendance Alert
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={() => setShowAttendanceAlert(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Quick Tips */}
      <div className="quick-tips">
        <h3>📌 Quick Tips</h3>
        <div className="tips-grid">
          <div className="tip-card">
            <div className="tip-icon">📤</div>
            <div className="tip-content">
              <strong>Send Immediately</strong>
              <p>Use "Send Now" to notify users right away</p>
            </div>
          </div>
          <div className="tip-card">
            <div className="tip-icon">💾</div>
            <div className="tip-content">
              <strong>Save as Draft</strong>
              <p>Save notifications for later editing and sending</p>
            </div>
          </div>
          <div className="tip-card">
            <div className="tip-icon">🎯</div>
            <div className="tip-content">
              <strong>Target Audience</strong>
              <p>Send to specific groups: All, Students, Teachers, or Year-wise</p>
            </div>
          </div>
          <div className="tip-card">
            <div className="tip-icon">⚠️</div>
            <div className="tip-content">
              <strong>Attendance Alerts</strong>
              <p>Automatically alert students with low attendance</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notification;