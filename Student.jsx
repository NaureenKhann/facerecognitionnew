import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Student.css';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const Student = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('pending'); // 'pending', 'all', 'add'
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    department: 'all',
    status: 'all',
    semester: 'all'
  });

  // Mock data - replace with API call
  const mockStudents = [
    {
      id: 1,
      studentId: 'STU2024001',
      name: 'John Doe',
      email: 'john@uni.edu',
      rollNumber: 'CSE001',
      department: 'Computer Science',
      semester: 5,
      section: 'A',
      registrationDate: '2024-01-15',
      status: 'pending',
      faceDataStatus: 'pending',
      faceImagesCount: 0,
      attendance: 85
    },
    {
      id: 2,
      studentId: 'STU2024002',
      name: 'Jane Smith',
      email: 'jane@uni.edu',
      rollNumber: 'ECE023',
      department: 'Electronics',
      semester: 3,
      section: 'B',
      registrationDate: '2024-01-16',
      status: 'active',
      faceDataStatus: 'approved',
      faceImagesCount: 8,
      attendance: 92
    },
    {
      id: 3,
      studentId: 'STU2024003',
      name: 'Alex Johnson',
      email: 'alex@uni.edu',
      rollNumber: 'CSE045',
      department: 'Computer Science',
      semester: 7,
      section: 'A',
      registrationDate: '2024-01-14',
      status: 'active',
      faceDataStatus: 'rejected',
      faceImagesCount: 3,
      attendance: 76
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStudents(mockStudents);
      setFilteredStudents(mockStudents);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    filterStudents();
  }, [searchTerm, filters, students]);

  const filterStudents = () => {
    let filtered = students;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by department
    if (filters.department !== 'all') {
      filtered = filtered.filter(student => student.department === filters.department);
    }

    // Filter by status
    if (filters.status !== 'all') {
      filtered = filtered.filter(student => student.status === filters.status);
    }

    // Filter by semester
    if (filters.semester !== 'all') {
      filtered = filtered.filter(student => student.semester === parseInt(filters.semester));
    }

    // Filter by tab selection
    if (selectedTab === 'pending') {
      filtered = filtered.filter(student => student.status === 'pending');
    }

    setFilteredStudents(filtered);
  };

  const handleApprove = async (studentId) => {
    if (window.confirm('Approve this student registration?')) {
      try {
        // API call would go here
        const updatedStudents = students.map(student =>
          student.studentId === studentId 
            ? { ...student, status: 'active' }
            : student
        );
        setStudents(updatedStudents);
        alert('Student approved successfully!');
      } catch (error) {
        alert('Error approving student');
      }
    }
  };

  const handleReject = (studentId) => {
    const reason = prompt('Please provide reason for rejection:');
    if (reason) {
      try {
        // API call would go here
        const updatedStudents = students.map(student =>
          student.studentId === studentId 
            ? { ...student, status: 'rejected', rejectionReason: reason }
            : student
        );
        setStudents(updatedStudents);
        alert('Student rejected successfully!');
      } catch (error) {
        alert('Error rejecting student');
      }
    }
  };

  const handleStatusChange = async (studentId, newStatus) => {
    try {
      // API call would go here
      const updatedStudents = students.map(student =>
        student.studentId === studentId 
          ? { ...student, status: newStatus }
          : student
      );
      setStudents(updatedStudents);
      alert(`Student status updated to ${newStatus}`);
    } catch (error) {
      alert('Error updating student status');
    }
  };

  const handleViewStudent = (student) => {
    setSelectedStudent(student);
    setShowModal(true);
  };

  const departments = ['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Electrical'];
  const semesters = [1, 2, 3, 4, 5, 6, 7, 8];

  const StudentModal = () => {
    if (!selectedStudent) return null;

    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header">
            <h2>Student Details</h2>
            <button 
              onClick={() => setShowModal(false)}
              className="modal-close"
            >
              ✕
            </button>
          </div>

          <div className="modal-body">
            {/* Tabs */}
            <div className="modal-tabs">
              <div className="modal-tab-list">
                <button className={`modal-tab ${selectedStudent.activeTab === 'profile' ? 'active' : ''}`}>
                  Profile
                </button>
                <button className={`modal-tab ${selectedStudent.activeTab === 'face' ? 'active' : ''}`}>
                  Face Dataset
                </button>
                <button className={`modal-tab ${selectedStudent.activeTab === 'attendance' ? 'active' : ''}`}>
                  Attendance
                </button>
              </div>
            </div>

            {/* Profile Tab Content */}
            <div className="modal-form-grid">
              <div className="form-group">
                <label className="required">Name</label>
                <input 
                  type="text" 
                  defaultValue={selectedStudent.name}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label className="required">Roll Number</label>
                <input 
                  type="text" 
                  defaultValue={selectedStudent.rollNumber}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label className="required">Email</label>
                <input 
                  type="email" 
                  defaultValue={selectedStudent.email}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label className="required">Department</label>
                <select 
                  defaultValue={selectedStudent.department}
                  className="form-control select-control"
                >
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="required">Semester</label>
                <select 
                  defaultValue={selectedStudent.semester}
                  className="form-control select-control"
                >
                  {semesters.map(sem => (
                    <option key={sem} value={sem}>{sem}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="required">Section</label>
                <input 
                  type="text" 
                  defaultValue={selectedStudent.section}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select 
                  defaultValue={selectedStudent.status}
                  className="form-control select-control"
                  onChange={(e) => handleStatusChange(selectedStudent.studentId, e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="active">Active</option>
                  <option value="rejected">Rejected</option>
                  <option value="disabled">Disabled</option>
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="form-actions">
              <button className="btn btn-secondary">
                Reset Password
              </button>
              <button className="btn btn-primary">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const AddStudentForm = () => {
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      rollNumber: '',
      department: '',
      semester: '',
      section: '',
      password: 'student123'
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      // API call to add student
      alert('Student added successfully!');
      setFormData({
        name: '',
        email: '',
        rollNumber: '',
        department: '',
        semester: '',
        section: '',
        password: 'student123'
      });
    };

    return (
      <div className="add-student-form">
        <h2>Add Student Manually</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label className="required">Full Name</label>
              <input 
                type="text" 
                required
                className="form-control"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label className="required">Roll Number</label>
              <input 
                type="text" 
                required
                className="form-control"
                value={formData.rollNumber}
                onChange={(e) => setFormData({...formData, rollNumber: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label className="required">Email</label>
              <input 
                type="email" 
                required
                className="form-control"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label className="required">Department</label>
              <select 
                required
                className="form-control select-control"
                value={formData.department}
                onChange={(e) => setFormData({...formData, department: e.target.value})}
              >
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="required">Semester</label>
              <select 
                required
                className="form-control select-control"
                value={formData.semester}
                onChange={(e) => setFormData({...formData, semester: e.target.value})}
              >
                <option value="">Select Semester</option>
                {semesters.map(sem => (
                  <option key={sem} value={sem}>{sem}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="required">Section</label>
              <input 
                type="text" 
                required
                className="form-control"
                value={formData.section}
                onChange={(e) => setFormData({...formData, section: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Default Password</label>
              <input 
                type="text" 
                className="form-control"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-medium mb-3">Face Dataset Options:</h3>
            <div className="radio-group">
              <label className="radio-option">
                <input type="radio" name="faceOption" defaultChecked />
                Student will upload later
              </label>
              <label className="radio-option">
                <input type="radio" name="faceOption" />
                Upload now
              </label>
              <label className="radio-option">
                <input type="radio" name="faceOption" />
                Skip face registration
              </label>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              Create Student
            </button>
            <button type="button" className="btn btn-secondary">
              Reset Form
            </button>
          </div>
        </form>
      </div>
    );
  };

  return (
    <div className="students-page">
      <Sidebar />
      
      <div className="page-main">
        <Header title="Students Management" />
        
        <div className="page-content student-management-container">
          {/* Header */}
          <div className="student-header">
            <h1>Student Management</h1>
            <div className="header-actions">
              <button 
                className="btn btn-success"
                onClick={() => setSelectedTab('add')}
              >
                + Add Student
              </button>
              <button className="btn btn-primary">
                Export Data
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-card-header">
                <div>
                  <div className="stat-card-title">Pending Review</div>
                  <div className="stat-card-value">{students.filter(s => s.status === 'pending').length}</div>
                </div>
              </div>
              <div className="stat-card-actions">
                <button 
                  className="btn btn-warning btn-sm"
                  onClick={() => setSelectedTab('pending')}
                >
                  Review Now
                </button>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-card-header">
                <div>
                  <div className="stat-card-title">Face Data Pending</div>
                  <div className="stat-card-value">{students.filter(s => s.faceDataStatus === 'pending').length}</div>
                </div>
              </div>
              <div className="stat-card-actions">
                <button className="btn btn-info btn-sm">
                  Check Now
                </button>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-card-header">
                <div>
                  <div className="stat-card-title">Low Attendance</div>
                  <div className="stat-card-value">{students.filter(s => s.attendance < 75).length}</div>
                </div>
              </div>
              <div className="stat-card-actions">
                <button className="btn btn-danger btn-sm">
                  Notify All
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="tabs-container">
            <div className="tabs-list">
              <button 
                className={`tab-button ${selectedTab === 'pending' ? 'active' : ''}`}
                onClick={() => setSelectedTab('pending')}
              >
                Pending Approvals
                <span className="tab-badge">{students.filter(s => s.status === 'pending').length}</span>
              </button>
              <button 
                className={`tab-button ${selectedTab === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedTab('all')}
              >
                All Students
                <span className="tab-badge">{students.length}</span>
              </button>
              <button 
                className={`tab-button ${selectedTab === 'add' ? 'active' : ''}`}
                onClick={() => setSelectedTab('add')}
              >
                Add Student
              </button>
            </div>
          </div>

          {selectedTab === 'add' ? (
            <AddStudentForm />
          ) : (
            <>
              {/* Filters and Search */}
              <div className="filters-section">
                <div className="filters-grid">
                  <div className="form-group">
                    <input 
                      type="text" 
                      placeholder="Search by name, roll number, or email..."
                      className="form-control"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <select 
                      className="form-control select-control"
                      value={filters.department}
                      onChange={(e) => setFilters({...filters, department: e.target.value})}
                    >
                      <option value="all">All Departments</option>
                      {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <select 
                      className="form-control select-control"
                      value={filters.status}
                      onChange={(e) => setFilters({...filters, status: e.target.value})}
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="active">Active</option>
                      <option value="rejected">Rejected</option>
                      <option value="disabled">Disabled</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Students Table */}
              <div className="table-container">
                {loading ? (
                  <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>Loading students...</p>
                  </div>
                ) : filteredStudents.length === 0 ? (
                  <div className="empty-state">
                    <p>No students found</p>
                  </div>
                ) : (
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Student ID</th>
                        <th>Name</th>
                        <th>Roll Number</th>
                        <th>Department</th>
                        <th>Semester</th>
                        <th>Status</th>
                        <th>Face Data</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.map((student) => (
                        <tr key={student.id}>
                          <td>
                            <div className="text-sm font-medium">{student.studentId}</div>
                          </td>
                          <td>
                            <div className="text-sm font-medium">{student.name}</div>
                            <div className="text-sm text-gray-500">{student.email}</div>
                          </td>
                          <td>
                            <div className="text-sm">{student.rollNumber}</div>
                          </td>
                          <td>
                            <div className="text-sm">{student.department}</div>
                          </td>
                          <td>
                            <div className="text-sm">Sem {student.semester} - {student.section}</div>
                          </td>
                          <td>
                            <span className={`badge badge-${student.status}`}>
                              {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                            </span>
                          </td>
                          <td>
                            <span className={`badge badge-face-${student.faceDataStatus}`}>
                              {student.faceDataStatus}
                            </span>
                          </td>
                          <td>
                            <div className="action-buttons">
                              {student.status === 'pending' && (
                                <>
                                  <button 
                                    onClick={() => handleApprove(student.studentId)}
                                    className="action-link approve"
                                  >
                                    Approve
                                  </button>
                                  <button 
                                    onClick={() => handleReject(student.studentId)}
                                    className="action-link reject"
                                  >
                                    Reject
                                  </button>
                                </>
                              )}
                              <button 
                                onClick={() => handleViewStudent(student)}
                                className="action-link view"
                              >
                                View
                              </button>
                              <button className="action-link edit">
                                Edit
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Pagination */}
              <div className="pagination">
                <div className="pagination-info">
                  Showing <strong>{filteredStudents.length}</strong> of{' '}
                  <strong>{students.length}</strong> students
                </div>
                <div className="pagination-buttons">
                  <button className="pagination-button">Previous</button>
                  <button className="pagination-button active">1</button>
                  <button className="pagination-button">2</button>
                  <button className="pagination-button">3</button>
                  <button className="pagination-button">Next</button>
                </div>
              </div>
            </>
          )}

          {/* Student Detail Modal */}
          {showModal && <StudentModal />}
        </div>
      </div>
    </div>
  );
};

export default Student;