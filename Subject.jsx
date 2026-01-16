import React, { useState, useEffect } from 'react';
import './Subject.css';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const Subject = () => {
  // State for years
  const [years, setYears] = useState([
    { id: 1, name: 'First Year (FY)', code: 'FY' },
    { id: 2, name: 'Second Year (SY)', code: 'SY' },
    { id: 3, name: 'Third Year (TY)', code: 'TY' },
    { id: 4, name: 'Final Year (FTY)', code: 'FTY' }
  ]);
  
  const [selectedYear, setSelectedYear] = useState(null);
  
  // State for teachers (from localStorage or mock data)
  const [teachers, setTeachers] = useState(() => {
    const storedTeachers = JSON.parse(localStorage.getItem('teachers') || '[]');
    if (storedTeachers.length > 0) {
      return storedTeachers.map(teacher => ({
        ...teacher,
        assignedSubjects: 0 // Initialize count
      }));
    }
    // Mock teachers if none exist
    return [
      { id: 1, name: 'Dr. Sharma', email: 'sharma@uni.edu', department: 'Computer Science', assignedSubjects: 0 },
      { id: 2, name: 'Prof. Gupta', email: 'gupta@uni.edu', department: 'Computer Science', assignedSubjects: 0 },
      { id: 3, name: 'Dr. Patel', email: 'patel@uni.edu', department: 'Electronics', assignedSubjects: 0 },
      { id: 4, name: 'Prof. Kumar', email: 'kumar@uni.edu', department: 'Mathematics', assignedSubjects: 0 },
      { id: 5, name: 'Dr. Singh', email: 'singh@uni.edu', department: 'Physics', assignedSubjects: 0 }
    ];
  });
  
  // State for subjects
  const [subjects, setSubjects] = useState(() => {
    const storedSubjects = JSON.parse(localStorage.getItem('subjects') || '[]');
    if (storedSubjects.length > 0) {
      return storedSubjects;
    }
    // Mock subjects if none exist
    return [
      { id: 1, code: 'DSA', name: 'Data Structures & Algorithms', yearId: 2, teacherId: null, teacherName: null },
      { id: 2, code: 'OOP', name: 'Object Oriented Programming', yearId: 2, teacherId: 1, teacherName: 'Dr. Sharma' },
      { id: 3, code: 'DBMS', name: 'Database Management Systems', yearId: 2, teacherId: null, teacherName: null },
      { id: 4, code: 'ML', name: 'Machine Learning', yearId: 3, teacherId: 2, teacherName: 'Prof. Gupta' },
      { id: 5, code: 'CN', name: 'Computer Networks', yearId: 3, teacherId: null, teacherName: null },
      { id: 6, code: 'OS', name: 'Operating Systems', yearId: 3, teacherId: null, teacherName: null },
      { id: 7, code: 'MATH101', name: 'Mathematics I', yearId: 1, teacherId: 4, teacherName: 'Prof. Kumar' },
      { id: 8, code: 'PHY101', name: 'Physics', yearId: 1, teacherId: 5, teacherName: 'Dr. Singh' },
      { id: 9, code: 'PROJ401', name: 'Project Work', yearId: 4, teacherId: null, teacherName: null }
    ];
  });
  
  // State for filtered subjects
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  
  // State for search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterByAssignment, setFilterByAssignment] = useState('all'); // 'all', 'assigned', 'unassigned'
  
  // State for adding new subject
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSubject, setNewSubject] = useState({
    code: '',
    name: '',
    yearId: ''
  });
  
  // State for assigning teacher
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedTeacherId, setSelectedTeacherId] = useState('');
  
  // Calculate subject counts per year
  const subjectCounts = years.map(year => ({
    ...year,
    count: subjects.filter(subject => subject.yearId === year.id).length,
    assigned: subjects.filter(subject => subject.yearId === year.id && subject.teacherId !== null).length
  }));
  
  // Filter subjects when year or filters change
  useEffect(() => {
    if (selectedYear) {
      let filtered = subjects.filter(subject => subject.yearId === selectedYear.id);
      
      // Filter by search term
      if (searchTerm) {
        filtered = filtered.filter(subject =>
          subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          subject.code.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      // Filter by assignment status
      if (filterByAssignment === 'assigned') {
        filtered = filtered.filter(subject => subject.teacherId !== null);
      } else if (filterByAssignment === 'unassigned') {
        filtered = filtered.filter(subject => subject.teacherId === null);
      }
      
      setFilteredSubjects(filtered);
    } else {
      setFilteredSubjects([]);
    }
  }, [selectedYear, subjects, searchTerm, filterByAssignment]);
  
  // Save subjects to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('subjects', JSON.stringify(subjects));
  }, [subjects]);
  
  // Save teachers to localStorage whenever they change
  useEffect(() => {
    const teachersToSave = teachers.map(({ assignedSubjects, ...rest }) => rest);
    localStorage.setItem('teachers', JSON.stringify(teachersToSave));
  }, [teachers]);
  
  // Handle year selection
  const handleYearSelect = (year) => {
    setSelectedYear(year);
    setNewSubject(prev => ({ ...prev, yearId: year.id }));
  };
  
  // Handle adding new subject
  const handleAddSubject = (e) => {
    e.preventDefault();
    
    if (!newSubject.code || !newSubject.name || !newSubject.yearId) {
      alert('Please fill all required fields');
      return;
    }
    
    // Check if subject code already exists
    const codeExists = subjects.some(subject => 
      subject.code.toLowerCase() === newSubject.code.toLowerCase() && 
      subject.yearId === parseInt(newSubject.yearId)
    );
    
    if (codeExists) {
      alert('Subject code already exists for this year!');
      return;
    }
    
    const subject = {
      id: Date.now(),
      code: newSubject.code.toUpperCase(),
      name: newSubject.name,
      yearId: parseInt(newSubject.yearId),
      teacherId: null,
      teacherName: null
    };
    
    setSubjects([...subjects, subject]);
    
    // Reset form
    setNewSubject({
      code: '',
      name: '',
      yearId: selectedYear?.id || ''
    });
    
    setShowAddForm(false);
    alert('Subject added successfully!');
  };
  
  // Handle editing subject
  const handleEditSubject = (subject) => {
    const newName = prompt('Enter new subject name:', subject.name);
    const newCode = prompt('Enter new subject code:', subject.code);
    
    if (newName && newCode) {
      const updatedSubjects = subjects.map(s => {
        if (s.id === subject.id) {
          return {
            ...s,
            name: newName,
            code: newCode.toUpperCase()
          };
        }
        return s;
      });
      
      setSubjects(updatedSubjects);
      alert('Subject updated successfully!');
    }
  };
  
  // Handle deleting subject
  const handleDeleteSubject = (subject) => {
    if (window.confirm(`Are you sure you want to delete "${subject.name}"?`)) {
      // Check if subject is assigned to a teacher
      if (subject.teacherId) {
        // Update teacher's assigned subjects count
        const updatedTeachers = teachers.map(teacher => {
          if (teacher.id === subject.teacherId) {
            return {
              ...teacher,
              assignedSubjects: Math.max(0, teacher.assignedSubjects - 1)
            };
          }
          return teacher;
        });
        setTeachers(updatedTeachers);
      }
      
      const updatedSubjects = subjects.filter(s => s.id !== subject.id);
      setSubjects(updatedSubjects);
      alert('Subject deleted successfully!');
    }
  };
  
  // Open assign teacher modal
  const openAssignModal = (subject) => {
    setSelectedSubject(subject);
    setSelectedTeacherId(subject.teacherId || '');
    setShowAssignModal(true);
  };
  
  // Handle assigning teacher
  const handleAssignTeacher = () => {
    if (!selectedTeacherId) {
      alert('Please select a teacher');
      return;
    }
    
    const selectedTeacher = teachers.find(t => t.id === parseInt(selectedTeacherId));
    
    // If subject already has a teacher, decrement that teacher's count
    if (selectedSubject.teacherId) {
      const previousTeacher = teachers.find(t => t.id === selectedSubject.teacherId);
      if (previousTeacher) {
        const updatedTeachers = teachers.map(teacher => {
          if (teacher.id === previousTeacher.id) {
            return {
              ...teacher,
              assignedSubjects: Math.max(0, teacher.assignedSubjects - 1)
            };
          }
          return teacher;
        });
        setTeachers(updatedTeachers);
      }
    }
    
    // Update subject with new teacher
    const updatedSubjects = subjects.map(subject => {
      if (subject.id === selectedSubject.id) {
        return {
          ...subject,
          teacherId: parseInt(selectedTeacherId),
          teacherName: selectedTeacher.name
        };
      }
      return subject;
    });
    
    // Update teacher's assigned subjects count
    const updatedTeachers = teachers.map(teacher => {
      if (teacher.id === parseInt(selectedTeacherId)) {
        return {
          ...teacher,
          assignedSubjects: teacher.assignedSubjects + 1
        };
      }
      return teacher;
    });
    
    setSubjects(updatedSubjects);
    setTeachers(updatedTeachers);
    setShowAssignModal(false);
    alert(`Teacher ${selectedTeacher.name} assigned to ${selectedSubject.name} successfully!`);
  };
  
  // Handle removing teacher assignment
  const handleRemoveAssignment = (subject) => {
    if (window.confirm(`Remove teacher assignment from "${subject.name}"?`)) {
      // Update teacher's assigned subjects count
      const updatedTeachers = teachers.map(teacher => {
        if (teacher.id === subject.teacherId) {
          return {
            ...teacher,
            assignedSubjects: Math.max(0, teacher.assignedSubjects - 1)
          };
        }
        return teacher;
      });
      
      // Remove teacher from subject
      const updatedSubjects = subjects.map(s => {
        if (s.id === subject.id) {
          return {
            ...s,
            teacherId: null,
            teacherName: null
          };
        }
        return s;
      });
      
      setSubjects(updatedSubjects);
      setTeachers(updatedTeachers);
      alert('Teacher assignment removed successfully!');
    }
  };
  
  // Get available teachers (with low workload)
  const getAvailableTeachers = () => {
    return teachers.filter(teacher => teacher.assignedSubjects < 3); // Max 3 subjects per teacher
  };
  
  return (
    <div className="subject-management-container">
      {/* Header */}
      <Header />
      <Sidebar />
      <div className="subject-header">
        <h1>Subject Management</h1>
        <div className="header-actions">
          <button 
            className="btn btn-success"
            onClick={() => setShowAddForm(!showAddForm)}
            disabled={!selectedYear}
          >
            {showAddForm ? 'Cancel' : '+ Add Subject'}
          </button>
        </div>
      </div>
      
      {/* Subject Count Summary */}
      <div className="subject-summary">
        <h3>Subject Count by Year</h3>
        <div className="summary-cards">
          {subjectCounts.map(year => (
            <div 
              key={year.id} 
              className={`summary-card ${selectedYear?.id === year.id ? 'active' : ''}`}
              onClick={() => handleYearSelect(year)}
            >
              <div className="year-name">{year.name}</div>
              <div className="year-stats">
                <span className="total-count">{year.count} Subjects</span>
                <span className="assigned-count">{year.assigned} Assigned</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Year Selection */}
      <div className="year-selection">
        <h3>Select Academic Year</h3>
        <div className="year-buttons">
          {years.map(year => (
            <button
              key={year.id}
              className={`year-btn ${selectedYear?.id === year.id ? 'active' : ''}`}
              onClick={() => handleYearSelect(year)}
            >
              {year.name}
            </button>
          ))}
        </div>
      </div>
      
      {selectedYear && (
        <>
          {/* Selected Year Info */}
          <div className="selected-year-info">
            <h2>
              Subjects for {selectedYear.name}
              <span className="subject-count"> ({filteredSubjects.length} subjects)</span>
            </h2>
            <div className="year-stats-badge">
              <span className="stat-item">
                <span className="stat-label">Total:</span>
                <span className="stat-value">{subjects.filter(s => s.yearId === selectedYear.id).length}</span>
              </span>
              <span className="stat-item">
                <span className="stat-label">Assigned:</span>
                <span className="stat-value assigned">{subjects.filter(s => s.yearId === selectedYear.id && s.teacherId !== null).length}</span>
              </span>
              <span className="stat-item">
                <span className="stat-label">Unassigned:</span>
                <span className="stat-value unassigned">{subjects.filter(s => s.yearId === selectedYear.id && s.teacherId === null).length}</span>
              </span>
            </div>
          </div>
          
          {/* Search and Filters */}
          <div className="search-filters">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search by subject name or code..."
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
            
            <div className="filter-buttons">
              <button 
                className={`filter-btn ${filterByAssignment === 'all' ? 'active' : ''}`}
                onClick={() => setFilterByAssignment('all')}
              >
                All Subjects
              </button>
              <button 
                className={`filter-btn ${filterByAssignment === 'assigned' ? 'active' : ''}`}
                onClick={() => setFilterByAssignment('assigned')}
              >
                Assigned Only
              </button>
              <button 
                className={`filter-btn ${filterByAssignment === 'unassigned' ? 'active' : ''}`}
                onClick={() => setFilterByAssignment('unassigned')}
              >
                Unassigned Only
              </button>
            </div>
          </div>
          
          {/* Add New Subject Form */}
          {showAddForm && (
            <div className="add-subject-form">
              <h3>Add New Subject</h3>
              <form onSubmit={handleAddSubject}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Subject Code *</label>
                    <input
                      type="text"
                      value={newSubject.code}
                      onChange={(e) => setNewSubject({...newSubject, code: e.target.value})}
                      placeholder="e.g., DSA, OOP, ML"
                      required
                    />
                    <small>Unique identifier for the subject</small>
                  </div>
                  
                  <div className="form-group">
                    <label>Subject Name *</label>
                    <input
                      type="text"
                      value={newSubject.name}
                      onChange={(e) => setNewSubject({...newSubject, name: e.target.value})}
                      placeholder="e.g., Data Structures & Algorithms"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Academic Year *</label>
                    <select
                      value={newSubject.yearId}
                      onChange={(e) => setNewSubject({...newSubject, yearId: e.target.value})}
                      required
                    >
                      <option value="">Select Year</option>
                      {years.map(year => (
                        <option key={year.id} value={year.id}>
                          {year.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">
                    Add Subject
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowAddForm(false);
                      setNewSubject({ code: '', name: '', yearId: selectedYear.id });
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {/* Subjects Table */}
          <div className="subjects-table-container">
            {filteredSubjects.length === 0 ? (
              <div className="empty-state">
                <p>No subjects found. {searchTerm ? 'Try a different search.' : 'Add your first subject above.'}</p>
              </div>
            ) : (
              <table className="subjects-table">
                <thead>
                  <tr>
                    <th>Subject Code</th>
                    <th>Subject Name</th>
                    <th>Assigned Teacher</th>
                    <th>Assignment Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubjects.map(subject => (
                    <tr key={subject.id}>
                      <td>
                        <div className="subject-code">{subject.code}</div>
                      </td>
                      <td>
                        <div className="subject-name">{subject.name}</div>
                        <div className="subject-meta">
                          <span className="year-badge">Year {subject.yearId}</span>
                        </div>
                      </td>
                      <td>
                        {subject.teacherName ? (
                          <div className="teacher-info">
                            <div className="teacher-name">{subject.teacherName}</div>
                            <div className="teacher-workload">
                              {teachers.find(t => t.id === subject.teacherId)?.assignedSubjects || 0} subjects
                            </div>
                          </div>
                        ) : (
                          <div className="no-teacher">Not Assigned</div>
                        )}
                      </td>
                      <td>
                        <div className={`assignment-status ${subject.teacherId ? 'assigned' : 'unassigned'}`}>
                          <span className="status-dot"></span>
                          {subject.teacherId ? 'Assigned' : 'Not Assigned'}
                        </div>
                      </td>
                      <td>
                        <div className="action-buttons">
                          {subject.teacherId ? (
                            <>
                              <button 
                                className="btn-action change"
                                onClick={() => openAssignModal(subject)}
                              >
                                Change
                              </button>
                              <button 
                                className="btn-action remove"
                                onClick={() => handleRemoveAssignment(subject)}
                              >
                                Remove
                              </button>
                            </>
                          ) : (
                            <button 
                              className="btn-action assign"
                              onClick={() => openAssignModal(subject)}
                            >
                              Assign
                            </button>
                          )}
                          <button 
                            className="btn-action edit"
                            onClick={() => handleEditSubject(subject)}
                          >
                            Edit
                          </button>
                          <button 
                            className="btn-action delete"
                            onClick={() => handleDeleteSubject(subject)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          
          {/* Quick Stats */}
          <div className="quick-stats">
            <div className="stat-card">
              <h4>Total Subjects</h4>
              <p className="stat-number">{subjects.filter(s => s.yearId === selectedYear.id).length}</p>
            </div>
            <div className="stat-card">
              <h4>Assigned</h4>
              <p className="stat-number assigned">{subjects.filter(s => s.yearId === selectedYear.id && s.teacherId !== null).length}</p>
            </div>
            <div className="stat-card">
              <h4>Unassigned</h4>
              <p className="stat-number unassigned">{subjects.filter(s => s.yearId === selectedYear.id && s.teacherId === null).length}</p>
            </div>
            <div className="stat-card">
              <h4>Available Teachers</h4>
              <p className="stat-number">{getAvailableTeachers().length}</p>
            </div>
          </div>
        </>
      )}
      
      {/* Teacher Assignment Modal */}
      {showAssignModal && selectedSubject && (
        <div className="modal-overlay">
          <div className="modal-content assign-modal">
            <div className="modal-header">
              <h2>
                {selectedSubject.teacherId ? 'Change Teacher for' : 'Assign Teacher to'} 
                <span className="subject-title"> {selectedSubject.name}</span>
              </h2>
              <button 
                onClick={() => setShowAssignModal(false)}
                className="modal-close"
              >
                ✕
              </button>
            </div>
            
            <div className="modal-body">
              <div className="subject-info">
                <div className="info-item">
                  <span className="info-label">Subject Code:</span>
                  <span className="info-value">{selectedSubject.code}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Current Teacher:</span>
                  <span className="info-value">
                    {selectedSubject.teacherName || 'None'}
                  </span>
                </div>
              </div>
              
              <div className="teacher-selection">
                <label>Select Teacher *</label>
                <select
                  value={selectedTeacherId}
                  onChange={(e) => setSelectedTeacherId(e.target.value)}
                  className="teacher-select"
                >
                  <option value="">Select a teacher...</option>
                  {getAvailableTeachers().map(teacher => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.name} ({teacher.department}) - {teacher.assignedSubjects} subjects
                    </option>
                  ))}
                </select>
                
                {getAvailableTeachers().length === 0 && (
                  <div className="warning-message">
                    ⚠ No teachers available. All teachers have reached maximum workload (3 subjects).
                  </div>
                )}
              </div>
              
              <div className="teacher-preview">
                {selectedTeacherId && (
                  <div className="preview-card">
                    <h4>Selected Teacher:</h4>
                    {(() => {
                      const teacher = teachers.find(t => t.id === parseInt(selectedTeacherId));
                      return teacher ? (
                        <>
                          <div className="teacher-details">
                            <strong>{teacher.name}</strong>
                            <div>{teacher.department}</div>
                            <div>Email: {teacher.email}</div>
                            <div>Currently teaching: {teacher.assignedSubjects} subjects</div>
                          </div>
                        </>
                      ) : null;
                    })()}
                  </div>
                )}
              </div>
              
              <div className="modal-actions">
                <button 
                  className="btn btn-primary"
                  onClick={handleAssignTeacher}
                  disabled={!selectedTeacherId}
                >
                  {selectedSubject.teacherId ? 'Change Teacher' : 'Assign Teacher'}
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={() => setShowAssignModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* No Year Selected */}
      {!selectedYear && (
        <div className="no-selection">
          <div className="empty-state">
            <h3>Welcome to Subject Management</h3>
            <p>Select an academic year from above to view and manage subjects.</p>
            <div className="instructions">
              <h4>How to use:</h4>
              <ol>
                <li>Click on a year card above to select it</li>
                <li>View all subjects for that year</li>
                <li>Add new subjects using the "+ Add Subject" button</li>
                <li>Assign teachers to unassigned subjects</li>
                <li>Edit or delete subjects as needed</li>
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Subject;