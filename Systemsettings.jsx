import React, { useState, useEffect } from 'react';
import './Systemsettings.css';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

const Systemsettings = () => {
  // Main settings state
  const [settings, setSettings] = useState({
    // College Details
    collegeName: 'University College',
    collegeCode: 'UC2024',
    addressLine1: '123 College Street',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    pinCode: '400001',
    contactEmail: 'admin@college.edu',
    contactPhone: '+91 9876543210',
    
    // GPS Location Settings
    latitude: '19.0760',
    longitude: '72.8777',
    geoRadius: 200, // meters
    gpsEnabled: false,
    
    // Academic Settings
    attendanceThreshold: 75,
    minSemesterCredits: 20,
    maxSemesterCredits: 30,
    
    // System Settings
    maintenanceMode: false,
    allowStudentRegistration: true,
    backupFrequency: 'daily',
    sessionTimeout: 30,
    
    // Security Settings
    requireStrongPasswords: true,
    maxLoginAttempts: 5,
    passwordExpiryDays: 90
  });
  
  // Loading state
  const [loading, setLoading] = useState(false);
  // Save status message
  const [saveStatus, setSaveStatus] = useState({ type: '', message: '' });
  // Active tab
  const [activeTab, setActiveTab] = useState('college');
  
  // State for password change
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // State for low attendance students
  const [lowAttendanceStudents, setLowAttendanceStudents] = useState([]);
  
  // Load settings and data on component mount
  useEffect(() => {
    // Load college settings
    const savedSettings = localStorage.getItem('collegeSettings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsedSettings }));
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
    
    // Load low attendance students
    loadLowAttendanceStudents();
  }, []);
  
  // Load students with low attendance (< 25%)
  const loadLowAttendanceStudents = () => {
    try {
      // Try to get from localStorage
      const students = JSON.parse(localStorage.getItem('students') || '[]');
      const attendanceRecords = JSON.parse(localStorage.getItem('attendance') || '[]');
      
      // Calculate attendance percentage for each student
      const studentAttendance = students.map(student => {
        const studentAtt = attendanceRecords.filter(
          record => record.studentId === student.id
        );
        
        const totalClasses = studentAtt.length;
        const presentClasses = studentAtt.filter(record => record.status === 'present').length;
        const attendancePercentage = totalClasses > 0 ? (presentClasses / totalClasses) * 100 : 0;
        
        return {
          id: student.id,
          rollNumber: student.rollNumber || `STU${student.id}`,
          name: student.name,
          year: student.year || 'FY',
          attendance: attendancePercentage.toFixed(1),
          totalClasses,
          presentClasses
        };
      });
      
      // Filter students with attendance < 25%
      const lowAttendance = studentAttendance.filter(s => parseFloat(s.attendance) < 25);
      setLowAttendanceStudents(lowAttendance);
      
    } catch (error) {
      console.error('Error loading attendance data:', error);
      
      // Mock data for demo
      setLowAttendanceStudents([
        { id: 1, rollNumber: 'STU001', name: 'John Doe', year: 'SY', attendance: '15.5', totalClasses: 40, presentClasses: 6 },
        { id: 2, rollNumber: 'STU002', name: 'Jane Smith', year: 'TY', attendance: '22.3', totalClasses: 45, presentClasses: 10 },
        { id: 3, rollNumber: 'STU003', name: 'Alex Johnson', year: 'FY', attendance: '10.2', totalClasses: 50, presentClasses: 5 }
      ]);
    }
  };
  
  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  // Handle password input changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Validate GPS coordinates
  const validateCoordinates = (lat, lng, radius) => {
    const errors = [];
    
    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);
    const radiusNum = parseInt(radius);
    
    if (isNaN(latNum) || latNum < -90 || latNum > 90) {
      errors.push('Latitude must be between -90 and +90');
    }
    
    if (isNaN(lngNum) || lngNum < -180 || lngNum > 180) {
      errors.push('Longitude must be between -180 and +180');
    }
    
    if (isNaN(radiusNum) || radiusNum <= 0) {
      errors.push('Radius must be greater than 0 meters');
    }
    
    return errors;
  };
  
  // Save settings
  const handleSaveSettings = () => {
    // Validate GPS coordinates if GPS is enabled
    if (settings.gpsEnabled) {
      const errors = validateCoordinates(
        settings.latitude,
        settings.longitude,
        settings.geoRadius
      );
      
      if (errors.length > 0) {
        setSaveStatus({
          type: 'error',
          message: `❌ ${errors.join(', ')}`
        });
        return;
      }
    }
    
    setLoading(true);
    setSaveStatus({ type: '', message: '' });
    
    // Simulate API call
    setTimeout(() => {
      try {
        // Save to localStorage
        localStorage.setItem('collegeSettings', JSON.stringify(settings));
        
        setSaveStatus({ 
          type: 'success', 
          message: 'Settings saved successfully!' 
        });
        
        // Reload low attendance data
        loadLowAttendanceStudents();
      } catch (error) {
        setSaveStatus({ 
          type: 'error', 
          message: 'Failed to save settings. Please try again.' 
        });
      } finally {
        setLoading(false);
        
        // Clear status message after 3 seconds
        setTimeout(() => {
          setSaveStatus({ type: '', message: '' });
        }, 3000);
      }
    }, 500);
  };
  
  // Handle password change
  const handleChangePassword = (e) => {
    e.preventDefault();
    
    const { currentPassword, newPassword, confirmPassword } = passwordData;
    
    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setSaveStatus({ type: 'error', message: '❌ All fields are required' });
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setSaveStatus({ type: 'error', message: '❌ New passwords do not match' });
      return;
    }
    
    if (newPassword.length < 8) {
      setSaveStatus({ type: 'error', message: '❌ Password must be at least 8 characters' });
      return;
    }
    
    // In real app, verify current password with backend
    // For demo, we'll simulate success
    setTimeout(() => {
      setSaveStatus({ 
        type: 'success', 
        message: '✅ Password changed successfully!' 
      });
      
      // Reset password form
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setSaveStatus({ type: '', message: '' });
      }, 3000);
    }, 1000);
  };
  
  // Get Google Maps URL
  const getGoogleMapsUrl = () => {
    return `https://www.google.com/maps?q=${settings.latitude},${settings.longitude}`;
  };
  
  // Tabs configuration
  const tabs = [
    { id: 'college', label: 'College Details', icon: '🏫' },
    { id: 'location', label: 'GPS Location', icon: '📍' },
    { id: 'attendance', label: 'Low Attendance', icon: '📊' },
    { id: 'security', label: 'Security', icon: '🔒' },
    { id: 'system', label: 'System', icon: '⚙️' }
  ];
  
  // Render current tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'college':
        return (
          <div className="settings-section">
            <Header />
            <Sidebar />
            <h3>College Profile</h3>
            <div className="settings-grid">
              <div className="setting-item">
                <label>College Name *</label>
                <input
                  type="text"
                  name="collegeName"
                  value={settings.collegeName}
                  onChange={handleInputChange}
                  placeholder="Enter college name"
                  required
                />
              </div>
              
              <div className="setting-item">
                <label>College Code *</label>
                <input
                  type="text"
                  name="collegeCode"
                  value={settings.collegeCode}
                  onChange={handleInputChange}
                  placeholder="Enter college code"
                  required
                />
              </div>
              
              <div className="setting-item full-width">
                <label>Address Line 1 *</label>
                <input
                  type="text"
                  name="addressLine1"
                  value={settings.addressLine1}
                  onChange={handleInputChange}
                  placeholder="Street address"
                  required
                />
              </div>
              
              <div className="setting-item">
                <label>City *</label>
                <input
                  type="text"
                  name="city"
                  value={settings.city}
                  onChange={handleInputChange}
                  placeholder="City"
                  required
                />
              </div>
              
              <div className="setting-item">
                <label>State *</label>
                <input
                  type="text"
                  name="state"
                  value={settings.state}
                  onChange={handleInputChange}
                  placeholder="State"
                  required
                />
              </div>
              
              <div className="setting-item">
                <label>Country *</label>
                <input
                  type="text"
                  name="country"
                  value={settings.country}
                  onChange={handleInputChange}
                  placeholder="Country"
                  required
                />
              </div>
              
              <div className="setting-item">
                <label>PIN Code *</label>
                <input
                  type="text"
                  name="pinCode"
                  value={settings.pinCode}
                  onChange={handleInputChange}
                  placeholder="PIN Code"
                  required
                />
              </div>
              
              <div className="setting-item">
                <label>Contact Email *</label>
                <input
                  type="email"
                  name="contactEmail"
                  value={settings.contactEmail}
                  onChange={handleInputChange}
                  placeholder="admin@college.edu"
                  required
                />
              </div>
              
              <div className="setting-item">
                <label>Contact Phone *</label>
                <input
                  type="tel"
                  name="contactPhone"
                  value={settings.contactPhone}
                  onChange={handleInputChange}
                  placeholder="+91 9876543210"
                  required
                />
              </div>
            </div>
            
            <div className="section-note">
              <p>📌 These details will be used throughout the system for all communications and records.</p>
            </div>
          </div>
        );
        
      case 'location':
        return (
          <div className="settings-section">
            <h3>GPS Location Settings</h3>
            
            <div className="gps-status">
              <div className="gps-toggle">
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    name="gpsEnabled"
                    checked={settings.gpsEnabled}
                    onChange={handleInputChange}
                  />
                  <span className="toggle-slider"></span>
                </label>
                <div className="toggle-label">
                  <span className="toggle-title">Location-Based Attendance</span>
                  <span className="toggle-description">
                    {settings.gpsEnabled 
                      ? '✅ GPS tracking enabled. Students must be within campus for attendance.'
                      : '❌ GPS tracking disabled. Attendance can be marked from anywhere.'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="settings-grid">
              <div className="setting-item">
                <label>Latitude *</label>
                <input
                  type="text"
                  name="latitude"
                  value={settings.latitude}
                  onChange={handleInputChange}
                  placeholder="e.g., 19.0760"
                  required
                  disabled={!settings.gpsEnabled}
                />
                <div className="hint">Between -90 to +90</div>
              </div>
              
              <div className="setting-item">
                <label>Longitude *</label>
                <input
                  type="text"
                  name="longitude"
                  value={settings.longitude}
                  onChange={handleInputChange}
                  placeholder="e.g., 72.8777"
                  required
                  disabled={!settings.gpsEnabled}
                />
                <div className="hint">Between -180 to +180</div>
              </div>
              
              <div className="setting-item">
                <label>Allowed Radius (meters) *</label>
                <input
                  type="number"
                  name="geoRadius"
                  value={settings.geoRadius}
                  onChange={handleInputChange}
                  min="50"
                  max="1000"
                  required
                  disabled={!settings.gpsEnabled}
                />
                <div className="hint">Students must be within this radius</div>
              </div>
            </div>
            
            {/* Location Preview */}
            <div className="location-preview">
              <h4>📍 College Location Preview</h4>
              {settings.gpsEnabled ? (
                <div className="preview-card">
                  <div className="preview-coordinates">
                    <div className="coordinate">
                      <span className="label">Latitude:</span>
                      <span className="value">{settings.latitude}</span>
                    </div>
                    <div className="coordinate">
                      <span className="label">Longitude:</span>
                      <span className="value">{settings.longitude}</span>
                    </div>
                    <div className="coordinate">
                      <span className="label">Allowed Radius:</span>
                      <span className="value">{settings.geoRadius} meters</span>
                    </div>
                  </div>
                  <div className="preview-actions">
                    <a 
                      href={getGoogleMapsUrl()} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn btn-outline"
                    >
                      🌍 View on Google Maps
                    </a>
                  </div>
                  <div className="preview-note">
                    <p>📌 Location stored for future GPS-based attendance. Currently {settings.gpsEnabled ? 'ENABLED' : 'DISABLED'}.</p>
                  </div>
                </div>
              ) : (
                <div className="preview-disabled">
                  <p>Location tracking is currently disabled. Enable to set GPS coordinates.</p>
                </div>
              )}
            </div>
          </div>
        );
        
      case 'attendance':
        return (
          <div className="settings-section">
            <h3>Students with Low Attendance (&lt;25%)</h3>
            
            <div className="attendance-summary">
              <div className="summary-card">
                <div className="summary-icon">⚠️</div>
                <div className="summary-content">
                  <div className="summary-number">{lowAttendanceStudents.length}</div>
                  <div className="summary-label">Students Below 25%</div>
                </div>
              </div>
            </div>
            
            {lowAttendanceStudents.length === 0 ? (
              <div className="no-data">
                <p>🎉 Great! No students have attendance below 25%.</p>
              </div>
            ) : (
              <div className="students-table-container">
                <table className="students-table">
                  <thead>
                    <tr>
                      <th>Roll No</th>
                      <th>Student Name</th>
                      <th>Year</th>
                      <th>Attendance %</th>
                      <th>Classes</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lowAttendanceStudents.map(student => (
                      <tr key={student.id} className="low-attendance-row">
                        <td>{student.rollNumber}</td>
                        <td>
                          <div className="student-name">{student.name}</div>
                        </td>
                        <td>
                          <span className="year-badge">{student.year}</span>
                        </td>
                        <td>
                          <div className="attendance-display">
                            <span className={`attendance-value ${parseFloat(student.attendance) < 15 ? 'critical' : 'warning'}`}>
                              {student.attendance}%
                            </span>
                            <div className="attendance-bar">
                              <div 
                                className="attendance-fill"
                                style={{ width: `${student.attendance}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td>
                          {student.presentClasses}/{student.totalClasses}
                        </td>
                        <td>
                          <button 
                            className="btn-action"
                            onClick={() => alert(`Contact ${student.name} about low attendance.`)}
                          >
                            📞 Contact
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            <div className="section-note">
              <p>📌 These students need immediate attention. Consider sending notifications or contacting parents.</p>
              <button 
                className="btn btn-secondary"
                onClick={loadLowAttendanceStudents}
              >
                🔄 Refresh List
              </button>
            </div>
          </div>
        );
        
      case 'security':
        return (
          <div className="settings-section">
            <h3>Security Settings</h3>
            
            <div className="password-change-form">
              <h4>Change Admin Password</h4>
              <form onSubmit={handleChangePassword}>
                <div className="form-group">
                  <label>Current Password</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter current password"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter new password"
                    required
                  />
                  <div className="hint">Minimum 8 characters with letters and numbers</div>
                </div>
                
                <div className="form-group">
                  <label>Confirm New Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="Confirm new password"
                    required
                  />
                </div>
                
                <button type="submit" className="btn btn-primary">
                  🔐 Change Password
                </button>
              </form>
            </div>
            
            <div className="security-settings">
              <h4>Other Security Settings</h4>
              <div className="settings-grid">
                <div className="setting-item checkbox">
                  <label>
                    <input
                      type="checkbox"
                      name="requireStrongPasswords"
                      checked={settings.requireStrongPasswords}
                      onChange={handleInputChange}
                    />
                    <span>Require Strong Passwords</span>
                  </label>
                  <div className="hint">For all users (students, teachers, admin)</div>
                </div>
                
                <div className="setting-item">
                  <label>Max Login Attempts</label>
                  <input
                    type="number"
                    name="maxLoginAttempts"
                    value={settings.maxLoginAttempts}
                    onChange={handleInputChange}
                    min="1"
                    max="10"
                  />
                  <div className="hint">Account lock after failed attempts</div>
                </div>
                
                <div className="setting-item">
                  <label>Password Expiry (Days)</label>
                  <input
                    type="number"
                    name="passwordExpiryDays"
                    value={settings.passwordExpiryDays}
                    onChange={handleInputChange}
                    min="30"
                    max="365"
                  />
                  <div className="hint">Force password change after expiry</div>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'system':
        return (
          <div className="settings-section">
            <h3>System Settings</h3>
            
            <div className="settings-grid">
              <div className="setting-item checkbox">
                <label>
                  <input
                    type="checkbox"
                    name="maintenanceMode"
                    checked={settings.maintenanceMode}
                    onChange={handleInputChange}
                  />
                  <span>Maintenance Mode</span>
                </label>
                <div className="hint">Show maintenance page to regular users</div>
              </div>
              
              <div className="setting-item checkbox">
                <label>
                  <input
                    type="checkbox"
                    name="allowStudentRegistration"
                    checked={settings.allowStudentRegistration}
                    onChange={handleInputChange}
                  />
                  <span>Allow Student Registration</span>
                </label>
                <div className="hint">Enable/disable new student signups</div>
              </div>
              
              <div className="setting-item">
                <label>Attendance Threshold (%)</label>
                <input
                  type="number"
                  name="attendanceThreshold"
                  value={settings.attendanceThreshold}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                />
                <div className="hint">Minimum required attendance percentage</div>
              </div>
              
              <div className="setting-item">
                <label>Session Timeout (Minutes)</label>
                <input
                  type="number"
                  name="sessionTimeout"
                  value={settings.sessionTimeout}
                  onChange={handleInputChange}
                  min="5"
                  max="180"
                />
                <div className="hint">Auto-logout after inactivity</div>
              </div>
              
              <div className="setting-item">
                <label>Backup Frequency</label>
                <select
                  name="backupFrequency"
                  value={settings.backupFrequency}
                  onChange={handleInputChange}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
                <div className="hint">Automatic data backup schedule</div>
              </div>
            </div>
            
            <div className="danger-zone">
              <h4>⚠️ System Actions</h4>
              <div className="danger-actions">
                <button 
                  className="btn btn-warning"
                  onClick={() => {
                    localStorage.clear();
                    alert('All data cleared. Page will reload.');
                    window.location.reload();
                  }}
                >
                  🗑️ Clear All Data
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={() => {
                    const data = JSON.stringify(settings, null, 2);
                    const blob = new Blob([data], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `college-settings-${new Date().toISOString().split('T')[0]}.json`;
                    a.click();
                  }}
                >
                  📤 Export Settings
                </button>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="system-settings-container">
      {/* Header */}
      <div className="settings-header">
        <h1>System Settings</h1>
        <div className="header-info">
          <p>Manage college details, location settings, and system preferences</p>
        </div>
      </div>
      
      {/* Status Message */}
      {saveStatus.message && (
        <div className={`status-message ${saveStatus.type}`}>
          {saveStatus.message}
        </div>
      )}
      
      {/* Main Content */}
      <div className="settings-content">
        {/* Tabs Navigation */}
        <div className="settings-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>
        
        {/* Settings Form */}
        <div className="settings-form">
          {renderTabContent()}
          
          {/* Save Button (Show for all tabs except attendance) */}
          {activeTab !== 'attendance' && (
            <div className="settings-actions">
              <button
                className="btn btn-primary"
                onClick={handleSaveSettings}
                disabled={loading}
              >
                {loading ? '💾 Saving...' : '💾 Save Changes'}
              </button>
            </div>
          )}
        </div>
        
       
         
          </div>
        </div>
  
  );
};

export default Systemsettings;