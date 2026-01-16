import React, { useState, useEffect } from 'react';
import { 
  Users, Search, Plus, Edit2, Trash2, Eye, Filter, 
  Download, Upload, UserPlus, UserCheck, UserX,
  Mail, Phone, BookOpen, Calendar, Clock, Shield,
  CheckCircle, XCircle, MoreVertical, ChevronRight
} from 'lucide-react';
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import './Teacher.css';

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  // Mock data - Replace with API call
  useEffect(() => {
    const fetchTeachers = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockTeachers = [
        {
          id: 'T001',
          fullName: 'Dr. Sarah Johnson',
          email: 'sarah.johnson@college.edu',
          phone: '+1 234-567-8901',
          department: 'Computer Science',
          departmentId: 'CS001',
          designation: 'Professor',
          subjects: ['Data Structures', 'Algorithms', 'DBMS'],
          profilePhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=T001',
          role: 'HOD',
          accessLevel: 'full',
          status: 'active',
          joinDate: '2022-01-15',
          assignedClasses: ['CS101-A', 'CS301-B'],
          totalClasses: 45,
          attendanceRate: 98.5,
          lastActive: '2024-01-16 10:30'
        },
        {
          id: 'T002',
          fullName: 'Prof. Michael Chen',
          email: 'michael.chen@college.edu',
          phone: '+1 234-567-8902',
          department: 'Mathematics',
          departmentId: 'MATH001',
          designation: 'Associate Professor',
          subjects: ['Calculus', 'Linear Algebra'],
          profilePhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=T002',
          role: 'Teacher',
          accessLevel: 'standard',
          status: 'active',
          joinDate: '2021-08-20',
          assignedClasses: ['MATH201-A'],
          totalClasses: 32,
          attendanceRate: 96.2,
          lastActive: '2024-01-16 09:15'
        },
        {
          id: 'T003',
          fullName: 'Dr. Emily Rodriguez',
          email: 'emily.rodriguez@college.edu',
          phone: '+1 234-567-8903',
          department: 'Physics',
          departmentId: 'PHY001',
          designation: 'Assistant Professor',
          subjects: ['Quantum Mechanics', 'Thermodynamics'],
          profilePhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=T003',
          role: 'Teacher',
          accessLevel: 'standard',
          status: 'inactive',
          joinDate: '2023-03-10',
          assignedClasses: [],
          totalClasses: 0,
          attendanceRate: 0,
          lastActive: '2024-01-10 14:45'
        },
        {
          id: 'T004',
          fullName: 'Prof. David Wilson',
          email: 'david.wilson@college.edu',
          phone: '+1 234-567-8904',
          department: 'Computer Science',
          departmentId: 'CS001',
          designation: 'Visiting Professor',
          subjects: ['Web Development', 'Mobile Apps'],
          profilePhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=T004',
          role: 'Guest Faculty',
          accessLevel: 'limited',
          status: 'active',
          joinDate: '2023-09-05',
          assignedClasses: ['CS401-C'],
          totalClasses: 18,
          attendanceRate: 95.8,
          lastActive: '2024-01-15 16:20'
        }
      ];
      
      setTeachers(mockTeachers);
      setLoading(false);
    };

    fetchTeachers();
  }, []);

  // Departments for filter
  const departments = [
    { id: 'all', name: 'All Departments' },
    { id: 'CS001', name: 'Computer Science' },
    { id: 'MATH001', name: 'Mathematics' },
    { id: 'PHY001', name: 'Physics' },
    { id: 'CHEM001', name: 'Chemistry' },
    { id: 'BIO001', name: 'Biology' }
  ];

  // Roles
  const roles = [
    { id: 'teacher', name: 'Teacher' },
    { id: 'hod', name: 'HOD' },
    { id: 'guest', name: 'Guest Faculty' }
  ];

  // Access Levels
  const accessLevels = [
    { id: 'full', name: 'Full Access', color: 'green' },
    { id: 'standard', name: 'Standard', color: 'blue' },
    { id: 'limited', name: 'Limited', color: 'yellow' },
    { id: 'readonly', name: 'Read Only', color: 'gray' }
  ];

  // Filter teachers based on search and department
  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = searchTerm === '' || 
      teacher.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = selectedDepartment === 'all' || 
      teacher.departmentId === selectedDepartment;
    
    const matchesTab = activeTab === 'all' || 
      (activeTab === 'active' && teacher.status === 'active') ||
      (activeTab === 'inactive' && teacher.status === 'inactive');
    
    return matchesSearch && matchesDepartment && matchesTab;
  });

  // Add new teacher
  const handleAddTeacher = (teacherData) => {
    const newTeacher = {
      id: `T${String(teachers.length + 1).padStart(3, '0')}`,
      ...teacherData,
      status: 'active',
      joinDate: new Date().toISOString().split('T')[0],
      totalClasses: 0,
      attendanceRate: 0,
      lastActive: new Date().toLocaleString()
    };
    
    setTeachers([...teachers, newTeacher]);
    setShowAddModal(false);
  };

  // Update teacher
  const handleUpdateTeacher = (updatedData) => {
    setTeachers(teachers.map(teacher => 
      teacher.id === selectedTeacher.id ? { ...teacher, ...updatedData } : teacher
    ));
    setShowEditModal(false);
  };

  // Delete teacher
  const handleDeleteTeacher = () => {
    if (selectedTeacher) {
      setTeachers(teachers.filter(teacher => teacher.id !== selectedTeacher.id));
      setShowDeleteModal(false);
    }
  };

  // Toggle teacher status
  const toggleTeacherStatus = (teacherId) => {
    setTeachers(teachers.map(teacher => 
      teacher.id === teacherId 
        ? { ...teacher, status: teacher.status === 'active' ? 'inactive' : 'active' }
        : teacher
    ));
  };

  // Export teachers data
  const exportToCSV = () => {
    const headers = ['ID', 'Full Name', 'Email', 'Phone', 'Department', 'Designation', 'Subjects', 'Role', 'Status'];
    const csvData = [
      headers.join(','),
      ...teachers.map(teacher => [
        teacher.id,
        `"${teacher.fullName}"`,
        teacher.email,
        teacher.phone,
        teacher.department,
        teacher.designation,
        `"${teacher.subjects.join(', ')}"`,
        teacher.role,
        teacher.status
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `teachers_export_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'success';
      case 'inactive': return 'danger';
      default: return 'secondary';
    }
  };

  if (loading) {
    return (
      <div className="teachers-page loading">
        <Sidebar />
        <div className="page-main">
          <Header title="Teachers Management" />
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading teachers...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="teachers-page">
      <Sidebar />
      
      <div className="page-main">
        <Header title="Teachers Management" />
        
        <div className="page-content">
          {/* Stats Overview */}
          <div className="stats-overview">
            <div className="stat-card">
              <div className="stat-icon total">
                <Users size={24} />
              </div>
              <div className="stat-content">
                <h3>Total Teachers</h3>
                <p className="stat-number">{teachers.length}</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon active">
                <UserCheck size={24} />
              </div>
              <div className="stat-content">
                <h3>Active</h3>
                <p className="stat-number">
                  {teachers.filter(t => t.status === 'active').length}
                </p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon inactive">
                <UserX size={24} />
              </div>
              <div className="stat-content">
                <h3>Inactive</h3>
                <p className="stat-number">
                  {teachers.filter(t => t.status === 'inactive').length}
                </p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon attendance">
                <Calendar size={24} />
              </div>
              <div className="stat-content">
                <h3>Avg. Attendance</h3>
                <p className="stat-number">
                  {teachers.length > 0 
                    ? `${(teachers.reduce((acc, t) => acc + t.attendanceRate, 0) / teachers.length).toFixed(1)}%`
                    : '0%'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Filters and Actions */}
          <div className="filters-section">
            <div className="search-box">
              <Search size={20} />
              <input
                type="text"
                placeholder="Search by name, email or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="filter-actions">
              <div className="tab-filters">
                <button 
                  className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
                  onClick={() => setActiveTab('all')}
                >
                  All Teachers
                </button>
                <button 
                  className={`tab-btn ${activeTab === 'active' ? 'active' : ''}`}
                  onClick={() => setActiveTab('active')}
                >
                  Active
                </button>
                <button 
                  className={`tab-btn ${activeTab === 'inactive' ? 'active' : ''}`}
                  onClick={() => setActiveTab('inactive')}
                >
                  Inactive
                </button>
              </div>
              
              <div className="action-buttons">
                <select 
                  className="department-filter"
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                >
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
                
                <button className="action-btn export" onClick={exportToCSV}>
                  <Download size={18} />
                  Export
                </button>
                
                <button className="action-btn import">
                  <Upload size={18} />
                  Import
                </button>
                
                <button 
                  className="action-btn primary"
                  onClick={() => setShowAddModal(true)}
                >
                  <UserPlus size={18} />
                  Add Teacher
                </button>
              </div>
            </div>
          </div>

          {/* Teachers Table */}
          <div className="teachers-table-container">
            <table className="teachers-table">
              <thead>
                <tr>
                  <th>Teacher</th>
                  <th>Department</th>
                  <th>Subjects</th>
                  <th>Role & Access</th>
                  <th>Classes</th>
                  <th>Attendance</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTeachers.map(teacher => (
                  <tr key={teacher.id}>
                    <td>
                      <div className="teacher-info">
                        <img 
                          src={teacher.profilePhoto} 
                          alt={teacher.fullName}
                          className="teacher-avatar"
                        />
                        <div className="teacher-details">
                          <div className="teacher-name">{teacher.fullName}</div>
                          <div className="teacher-meta">
                            <span className="teacher-id">{teacher.id}</span>
                            <span className="teacher-email">{teacher.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="department-cell">
                        <span className="dept-name">{teacher.department}</span>
                        <span className="dept-id">{teacher.departmentId}</span>
                      </div>
                    </td>
                    <td>
                      <div className="subjects-cell">
                        {teacher.subjects.slice(0, 2).map((subject, idx) => (
                          <span key={idx} className="subject-tag">{subject}</span>
                        ))}
                        {teacher.subjects.length > 2 && (
                          <span className="more-subjects">+{teacher.subjects.length - 2}</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="role-access-cell">
                        <span className={`role-tag ${teacher.role}`}>
                          {teacher.role === 'hod' ? 'HOD' : 
                           teacher.role === 'guest' ? 'Guest Faculty' : 'Teacher'}
                        </span>
                        <span className={`access-level ${teacher.accessLevel}`}>
                          {teacher.accessLevel}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="classes-cell">
                        <div className="class-count">
                          <BookOpen size={14} />
                          <span>{teacher.assignedClasses.length} classes</span>
                        </div>
                        {teacher.assignedClasses.length > 0 && (
                          <div className="class-list">
                            {teacher.assignedClasses.join(', ')}
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="attendance-cell">
                        <div className="attendance-rate">
                          <div className="rate-bar">
                            <div 
                              className="rate-fill"
                              style={{ width: `${teacher.attendanceRate}%` }}
                            ></div>
                          </div>
                          <span className="rate-text">{teacher.attendanceRate}%</span>
                        </div>
                        <div className="total-classes">
                          {teacher.totalClasses} sessions
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="status-cell">
                        <span className={`status-badge ${getStatusColor(teacher.status)}`}>
                          {teacher.status === 'active' ? (
                            <>
                              <CheckCircle size={12} />
                              Active
                            </>
                          ) : (
                            <>
                              <XCircle size={12} />
                              Inactive
                            </>
                          )}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="action-cell">
                        <button 
                          className="action-icon view"
                          onClick={() => {
                            setSelectedTeacher(teacher);
                            // Navigate to teacher details
                          }}
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          className="action-icon edit"
                          onClick={() => {
                            setSelectedTeacher(teacher);
                            setShowEditModal(true);
                          }}
                          title="Edit Teacher"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          className="action-icon assign"
                          onClick={() => {
                            setSelectedTeacher(teacher);
                            setShowAssignmentModal(true);
                          }}
                          title="Assign Classes"
                        >
                          <Calendar size={16} />
                        </button>
                        <button 
                          className="action-icon delete"
                          onClick={() => {
                            setSelectedTeacher(teacher);
                            setShowDeleteModal(true);
                          }}
                          title="Delete Teacher"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredTeachers.length === 0 && (
              <div className="empty-state">
                <Users size={48} />
                <h3>No teachers found</h3>
                <p>Try adjusting your search or filters</p>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="quick-stats">
            <div className="stat-item">
              <h4>Teaching Load Distribution</h4>
              <div className="load-chart">
                {departments.slice(1).map(dept => {
                  const count = teachers.filter(t => t.departmentId === dept.id).length;
                  const percentage = (count / teachers.length) * 100;
                  return (
                    <div key={dept.id} className="load-bar">
                      <div className="bar-label">
                        <span>{dept.name}</span>
                        <span>{count} teachers</span>
                      </div>
                      <div className="bar-container">
                        <div 
                          className="bar-fill"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="stat-item">
              <h4>Attendance Summary</h4>
              <div className="attendance-summary">
                <div className="summary-item">
                  <span className="label">Excellent (95%+)</span>
                  <span className="value">
                    {teachers.filter(t => t.attendanceRate >= 95).length}
                  </span>
                </div>
                <div className="summary-item">
                  <span className="label">Good (85-94%)</span>
                  <span className="value">
                    {teachers.filter(t => t.attendanceRate >= 85 && t.attendanceRate < 95).length}
                  </span>
                </div>
                <div className="summary-item">
                  <span className="label">Needs Improvement (&lt;85%)</span>
                  <span className="value">
                    {teachers.filter(t => t.attendanceRate < 85).length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Teacher Modal */}
      {showAddModal && (
        <AddTeacherModal 
          onClose={() => setShowAddModal(false)}
          onSave={handleAddTeacher}
          departments={departments.slice(1)}
          roles={roles}
          accessLevels={accessLevels}
        />
      )}

      {/* Edit Teacher Modal */}
      {showEditModal && selectedTeacher && (
        <EditTeacherModal 
          teacher={selectedTeacher}
          onClose={() => setShowEditModal(false)}
          onSave={handleUpdateTeacher}
          departments={departments.slice(1)}
          roles={roles}
          accessLevels={accessLevels}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedTeacher && (
        <DeleteTeacherModal 
          teacher={selectedTeacher}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteTeacher}
        />
      )}

      {/* Assignment Modal */}
      {showAssignmentModal && selectedTeacher && (
        <AssignmentModal 
          teacher={selectedTeacher}
          onClose={() => setShowAssignmentModal(false)}
          onSave={(assignments) => {
            handleUpdateTeacher({ assignedClasses: assignments });
            setShowAssignmentModal(false);
          }}
        />
      )}
    </div>
  );
};

// Modal Components
const AddTeacherModal = ({ onClose, onSave, departments, roles, accessLevels }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    departmentId: '',
    designation: '',
    subjects: [],
    role: 'teacher',
    accessLevel: 'standard'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h3>Add New Teacher</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="teacher-form">
          <div className="form-grid">
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                placeholder="Enter full name"
              />
            </div>
            
            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="teacher@college.edu"
              />
            </div>
            
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="+1 234-567-8900"
              />
            </div>
            
            <div className="form-group">
              <label>Department *</label>
              <select
                required
                value={formData.departmentId}
                onChange={(e) => setFormData({...formData, departmentId: e.target.value})}
              >
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.id}>{dept.name}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Designation</label>
              <input
                type="text"
                value={formData.designation}
                onChange={(e) => setFormData({...formData, designation: e.target.value})}
                placeholder="Professor / Assistant Professor"
              />
            </div>
            
            <div className="form-group">
              <label>Subjects</label>
              <input
                type="text"
                value={formData.subjects.join(', ')}
                onChange={(e) => setFormData({
                  ...formData, 
                  subjects: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                })}
                placeholder="Math, Physics, Chemistry (comma separated)"
              />
            </div>
            
            <div className="form-group">
              <label>Role</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
              >
                {roles.map(role => (
                  <option key={role.id} value={role.id}>{role.name}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Access Level</label>
              <select
                value={formData.accessLevel}
                onChange={(e) => setFormData({...formData, accessLevel: e.target.value})}
              >
                {accessLevels.map(level => (
                  <option key={level.id} value={level.id}>{level.name}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Add Teacher
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const EditTeacherModal = ({ teacher, onClose, onSave, departments, roles, accessLevels }) => {
  const [formData, setFormData] = useState({ ...teacher });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h3>Edit Teacher</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="teacher-form">
          <div className="form-grid">
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              />
            </div>
            
            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
            
            <div className="form-group">
              <label>Department *</label>
              <select
                required
                value={formData.departmentId}
                onChange={(e) => setFormData({...formData, departmentId: e.target.value})}
              >
                {departments.map(dept => (
                  <option key={dept.id} value={dept.id}>{dept.name}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Designation</label>
              <input
                type="text"
                value={formData.designation}
                onChange={(e) => setFormData({...formData, designation: e.target.value})}
              />
            </div>
            
            <div className="form-group">
              <label>Subjects</label>
              <input
                type="text"
                value={formData.subjects.join(', ')}
                onChange={(e) => setFormData({
                  ...formData, 
                  subjects: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                })}
                placeholder="Math, Physics, Chemistry (comma separated)"
              />
            </div>
            
            <div className="form-group">
              <label>Role</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
              >
                {roles.map(role => (
                  <option key={role.id} value={role.id}>{role.name}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Access Level</label>
              <select
                value={formData.accessLevel}
                onChange={(e) => setFormData({...formData, accessLevel: e.target.value})}
              >
                {accessLevels.map(level => (
                  <option key={level.id} value={level.id}>{level.name}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Update Teacher
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const DeleteTeacherModal = ({ teacher, onClose, onConfirm }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-container delete-modal">
        <div className="modal-header">
          <h3>Delete Teacher</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <div className="warning-icon">
            <Trash2 size={48} />
          </div>
          <p>Are you sure you want to delete this teacher?</p>
          <div className="teacher-preview">
            <img src={teacher.profilePhoto} alt={teacher.fullName} />
            <div>
              <h4>{teacher.fullName}</h4>
              <p>{teacher.email}</p>
              <p>{teacher.department}</p>
            </div>
          </div>
          <p className="warning-text">
            This action cannot be undone. All attendance records and data associated with this teacher will be permanently deleted.
          </p>
        </div>
        
        <div className="modal-footer">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn-danger" onClick={onConfirm}>
            Delete Teacher
          </button>
        </div>
      </div>
    </div>
  );
};

const AssignmentModal = ({ teacher, onClose, onSave }) => {
  const [assignments, setAssignments] = useState([...teacher.assignedClasses]);
  const [newClass, setNewClass] = useState('');

  const handleAddClass = () => {
    if (newClass.trim()) {
      setAssignments([...assignments, newClass.trim()]);
      setNewClass('');
    }
  };

  const handleRemoveClass = (index) => {
    setAssignments(assignments.filter((_, i) => i !== index));
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h3>Assign Classes to {teacher.fullName}</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <div className="assignment-form">
            <div className="form-group">
              <label>Add Class/Section</label>
              <div className="input-group">
                <input
                  type="text"
                  value={newClass}
                  onChange={(e) => setNewClass(e.target.value)}
                  placeholder="e.g., CS101-A, MATH201-B"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddClass()}
                />
                <button type="button" className="btn-small" onClick={handleAddClass}>
                  Add
                </button>
              </div>
            </div>
            
            <div className="assigned-classes">
              <h4>Assigned Classes</h4>
              {assignments.length === 0 ? (
                <p className="no-classes">No classes assigned yet</p>
              ) : (
                <div className="class-list">
                  {assignments.map((className, index) => (
                    <div key={index} className="class-item">
                      <span>{className}</span>
                      <button 
                        type="button" 
                        className="remove-btn"
                        onClick={() => handleRemoveClass(index)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="modal-footer">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button 
            type="button" 
            className="btn-primary" 
            onClick={() => onSave(assignments)}
          >
            Save Assignments
          </button>
        </div>
      </div>
    </div>
  );
};

export default Teachers;