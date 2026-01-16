import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserCheck, 
  BarChart3, 
  Clock,
  Calendar,
  BookOpen,
  Settings,
  Plus,
  Download,
  Bell,
  AlertCircle,
  CheckCircle2,
  FileText,
  UserPlus,
  BookPlus,
} from 'lucide-react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import '../styles/Admindash.css';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    todayAttendance: {
      present: 0,
      totalSessions: 0
    },
    recentNotifications: [],
    recentActivity: []
  });

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch dashboard data from localStorage and simulate API
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      try {
        // Get students and teachers from localStorage
        const storedStudents = JSON.parse(localStorage.getItem('students') || '[]');
        const storedTeachers = JSON.parse(localStorage.getItem('teachers') || '[]');
        const attendanceRecords = JSON.parse(localStorage.getItem('attendanceRecords') || '[]');
        
        // Calculate today's attendance
        const today = new Date().toISOString().split('T')[0];
        const todayAttendance = attendanceRecords.filter(record => 
          record.date === today && record.status === 'present'
        );
        
        // Get recent notifications (attendance summaries from teachers)
        const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
        
        // Prepare dashboard data
        const data = {
          totalStudents: storedStudents.length,
          totalTeachers: storedTeachers.length,
          todayAttendance: {
            present: todayAttendance.length,
            totalSessions: attendanceRecords.filter(record => record.date === today).length
          },
          recentNotifications: notifications.slice(0, 5),
          recentActivity: [
            ...storedStudents.slice(-3).map(student => ({
              id: `student-${student.id}`,
              user: student.name,
              action: 'was added to system',
              time: 'Recently',
              role: 'student'
            })),
            ...storedTeachers.slice(-2).map(teacher => ({
              id: `teacher-${teacher.id}`,
              user: teacher.name,
              action: 'joined the faculty',
              time: 'Recently',
              role: 'teacher'
            }))
          ]
        };
        
        setDashboardData(data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    
    // Listen for storage changes to update in real-time
    const handleStorageChange = () => {
      fetchDashboardData();
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Calculate attendance percentage
  const attendancePercentage = dashboardData.totalStudents > 0 && dashboardData.todayAttendance.totalSessions > 0
    ? ((dashboardData.todayAttendance.present / (dashboardData.totalStudents * dashboardData.todayAttendance.totalSessions)) * 100).toFixed(1)
    : 0;

  // Quick action handlers - SIMPLIFIED VERSION
  const handleAddStudent = () => {
    navigate('/admin/students');
  };

  const handleAddTeacher = () => {
    navigate('/admin/teachers');
  };

  const handleCreateTimetable = () => {
    navigate('/admin/timetable');
  };

  const handleManageSubjects = () => {
    // Show a message since this route doesn't exist yet
    alert('Subjects management page is under development');
  };

  const handleSystemSettings = () => {
    // Show a message since this route doesn't exist yet
    alert('System settings page is under development');
  };

  const handleViewActivity = () => {
    // Show a message since this route doesn't exist yet
    alert('Activity log page is under development');
  };

  const handleGenerateReport = () => {
    // Generate and download attendance report
    generateAttendanceReport();
  };

  const generateAttendanceReport = () => {
    const attendanceData = JSON.parse(localStorage.getItem('attendanceRecords') || '[]');
    const students = JSON.parse(localStorage.getItem('students') || '[]');
    
    // Create CSV content
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Student ID,Student Name,Date,Status,Class,Subject\n";
    
    attendanceData.forEach(record => {
      const student = students.find(s => s.id === record.studentId);
      if (student) {
        csvContent += `${student.id},"${student.name}","${record.date}","${record.status}","${record.class || 'N/A'}","${record.subject || 'N/A'}"\n`;
      }
    });
    
    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `attendance_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Mark notification as read
  const markNotificationAsRead = (id) => {
    const updatedNotifications = dashboardData.recentNotifications.filter(notif => notif.id !== id);
    setDashboardData(prev => ({
      ...prev,
      recentNotifications: updatedNotifications
    }));
    
    // Update localStorage
    const allNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    const filteredNotifications = allNotifications.filter(notif => notif.id !== id);
    localStorage.setItem('notifications', JSON.stringify(filteredNotifications));
  };

  if (loading) {
    return (
      <div className="admin-dashboard loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <Sidebar />
      
      <div className="dashboard-main">
        <Header title="Admin Dashboard" />
        
        {/* Main Content */}
        <div className="dashboard-content">
          {/* Welcome Section */}
          <div className="welcome-section">
            <div className="welcome-text">
              <h1>Welcome back, Administrator!</h1>
              <p>Manage your institution's attendance system effectively.</p>
            </div>
            <div className="quick-stats-header">
              <div className="last-updated">
                <Clock size={16} />
                <span>Last updated: {new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          </div>

          {/* Quick Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon students">
                <Users size={24} />
              </div>
              <div className="stat-content">
                <h3>Total Students</h3>
                <p className="stat-number">{dashboardData.totalStudents}</p>
                <div className="stat-actions">
                  <button onClick={handleAddStudent} className="add-btn">
                    <Plus size={16} />
                    Add Student
                  </button>
                </div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon teachers">
                <UserCheck size={24} />
              </div>
              <div className="stat-content">
                <h3>Total Teachers</h3>
                <p className="stat-number">{dashboardData.totalTeachers}</p>
                <div className="stat-actions">
                  <button onClick={handleAddTeacher} className="add-btn">
                    <Plus size={16} />
                    Add Teacher
                  </button>
                </div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon attendance">
                <BarChart3 size={24} />
              </div>
              <div className="stat-content">
                <h3>Today's Attendance</h3>
                <p className="stat-number">{attendancePercentage}%</p>
                <span className="stat-detail">
                  {dashboardData.todayAttendance.present} present out of {dashboardData.totalStudents} students
                </span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon reports">
                <FileText size={24} />
              </div>
              <div className="stat-content">
                <h3>Attendance Reports</h3>
                <p className="stat-number">{dashboardData.todayAttendance.totalSessions}</p>
                <span className="stat-detail">
                  Sessions conducted today
                </span>
              </div>
            </div>
          </div>

          {/* Middle Section - Attendance Overview and Quick Actions */}
          <div className="middle-section">
            {/* Attendance Overview */}
            <div className="overview-card">
              <div className="chart-header">
                <h3>Attendance Overview</h3>
                <button className="export-btn" onClick={handleGenerateReport}>
                  <Download size={16} />
                  Generate Report
                </button>
              </div>
              
              <div className="attendance-summary">
                {dashboardData.totalStudents === 0 ? (
                  <div className="empty-state">
                    <Users size={48} />
                    <h4>No Students Added Yet</h4>
                    <p>Add students to start tracking attendance</p>
                    <button onClick={handleAddStudent} className="primary-btn">
                      <UserPlus size={18} />
                      Add First Student
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="summary-stats">
                      <div className="summary-item">
                        <span className="label">Total Students:</span>
                        <span className="value">{dashboardData.totalStudents}</span>
                      </div>
                      <div className="summary-item">
                        <span className="label">Today's Sessions:</span>
                        <span className="value">{dashboardData.todayAttendance.totalSessions}</span>
                      </div>
                      <div className="summary-item">
                        <span className="label">Present Today:</span>
                        <span className="value highlight">{dashboardData.todayAttendance.present}</span>
                      </div>
                    </div>
                    
                    <div className="attendance-breakdown">
                      <h4>Attendance Rate</h4>
                      <div className="percentage-display">
                        <div className="percentage-circle">
                          <svg width="120" height="120" viewBox="0 0 120 120">
                            <circle 
                              cx="60" 
                              cy="60" 
                              r="54" 
                              fill="none" 
                              stroke="#e5e7eb" 
                              strokeWidth="12"
                            />
                            <circle 
                              cx="60" 
                              cy="60" 
                              r="54" 
                              fill="none" 
                              stroke="#10b981" 
                              strokeWidth="12"
                              strokeDasharray={`${attendancePercentage * 3.4} 340`}
                              transform="rotate(-90 60 60)"
                            />
                          </svg>
                          <div className="percentage-text">
                            <span className="percentage">{attendancePercentage}%</span>
                            <span className="percentage-label">Today</span>
                          </div>
                        </div>
                        <div className="percentage-details">
                          <p>Based on today's attendance sessions</p>
                          <p>Each session contributes to overall attendance</p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions-card">
              <div className="chart-header">
                <h3>Quick Actions</h3>
              </div>
              <div className="quick-actions-grid">
                <button onClick={handleAddStudent} className="action-btn primary">
                  <UserPlus size={24} />
                  <span>Add Student</span>
                  <p>Register new student with face data</p>
                </button>
                
                <button onClick={handleAddTeacher} className="action-btn secondary">
                  <UserPlus size={24} />
                  <span>Add Teacher</span>
                  <p>Register new faculty member</p>
                </button>

                <button onClick={handleCreateTimetable} className="action-btn tertiary">
                  <Calendar size={24} />
                  <span>Create Timetable</span>
                  <p>Schedule classes and subjects</p>
                </button>
                
                <button className="action-btn quaternary" onClick={handleManageSubjects}>
                  <BookPlus size={24} />
                  <span>Manage Subjects</span>
                  <p>Add or edit course subjects</p>
                </button>
                
                <button className="action-btn warning" onClick={handleSystemSettings}>
                  <Settings size={24} />
                  <span>System Settings</span>
                  <p>Configure attendance parameters</p>
                </button>
                
                <button className="action-btn info" onClick={handleGenerateReport}>
                  <Download size={24} />
                  <span>Generate Reports</span>
                  <p>Download attendance analytics</p>
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Section - Notifications and Recent Activity */}
          <div className="bottom-section">
            {/* Notifications */}
            <div className="notifications-card">
              <div className="chart-header">
                <div className="notification-header-title">
                  <Bell size={20} />
                  <h3>Recent Notifications</h3>
                  <span className="notification-count">
                    {dashboardData.recentNotifications.length}
                  </span>
                </div>
                <button 
                  className="clear-btn"
                  onClick={() => {
                    localStorage.setItem('notifications', '[]');
                    setDashboardData(prev => ({ ...prev, recentNotifications: [] }));
                  }}
                  disabled={dashboardData.recentNotifications.length === 0}
                >
                  Clear All
                </button>
              </div>
              
              <div className="notifications-list">
                {dashboardData.recentNotifications.length === 0 ? (
                  <div className="empty-notifications">
                    <CheckCircle2 size={48} />
                    <p>No new notifications</p>
                    <small>Attendance summaries will appear here</small>
                  </div>
                ) : (
                  dashboardData.recentNotifications.map(notification => (
                    <div key={notification.id} className="notification-item">
                      <div className="notification-icon">
                        {notification.type === 'attendance' && <Calendar size={18} />}
                        {notification.type === 'teacher' && <UserCheck size={18} />}
                        {notification.type === 'system' && <AlertCircle size={18} />}
                      </div>
                      <div className="notification-content">
                        <div className="notification-header">
                          <strong>{notification.title}</strong>
                          <button 
                            className="mark-read-btn"
                            onClick={() => markNotificationAsRead(notification.id)}
                          >
                            ×
                          </button>
                        </div>
                        <p className="notification-message">{notification.message}</p>
                        <div className="notification-meta">
                          <span className="notification-time">{notification.time}</span>
                          {notification.teacher && (
                            <span className="notification-teacher">By: {notification.teacher}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="activity-card">
              <div className="chart-header">
                <h3>Recent Activity</h3>
                <button className="view-all-btn" onClick={handleViewActivity}>
                  View All
                </button>
              </div>
              
              <div className="activity-list">
                {dashboardData.recentActivity.length === 0 ? (
                  <div className="empty-activity">
                    <Users size={48} />
                    <p>No recent activity</p>
                    <small>Activity will appear here as you manage the system</small>
                  </div>
                ) : (
                  dashboardData.recentActivity.map(activity => (
                    <div key={activity.id} className="activity-item">
                      <div className={`activity-icon ${activity.role}`}>
                        {activity.role === 'student' && <Users size={16} />}
                        {activity.role === 'teacher' && <UserCheck size={16} />}
                      </div>
                      <div className="activity-details">
                        <p className="activity-text">
                          <strong>{activity.user}</strong> {activity.action}
                        </p>
                        <span className="activity-time">{activity.time}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;