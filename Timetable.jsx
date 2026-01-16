import React, { useState, useEffect } from 'react';
import './Timetable.css';
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

const Timetable = () => {
  // State for years
  const [years, setYears] = useState([
    { id: 1, name: 'First Year (FY)', code: 'FY' },
    { id: 2, name: 'Second Year (SY)', code: 'SY' },
    { id: 3, name: 'Third Year (TY)', code: 'TY' },
    { id: 4, name: 'Final Year (FTY)', code: 'FTY' }
  ]);
  
  const [selectedYear, setSelectedYear] = useState(null);
  
  // State for subjects
  const [subjects, setSubjects] = useState([
    { id: 1, name: 'Data Structures & Algorithms', code: 'DSA', yearId: 2 },
    { id: 2, name: 'Object Oriented Programming', code: 'OOP', yearId: 2 },
    { id: 3, name: 'Database Management Systems', code: 'DBMS', yearId: 2 },
    { id: 4, name: 'Machine Learning', code: 'ML', yearId: 3 },
    { id: 5, name: 'Computer Networks', code: 'CN', yearId: 3 },
    { id: 6, name: 'Operating Systems', code: 'OS', yearId: 3 },
    { id: 7, name: 'Mathematics I', code: 'MATH101', yearId: 1 },
    { id: 8, name: 'Physics', code: 'PHY101', yearId: 1 },
    { id: 9, name: 'Project Work', code: 'PROJ401', yearId: 4 }
  ]);
  
  const [availableSubjects, setAvailableSubjects] = useState([]);
  
  // State for teachers (from localStorage or mock data)
  const [teachers, setTeachers] = useState(() => {
    const storedTeachers = JSON.parse(localStorage.getItem('teachers') || '[]');
    if (storedTeachers.length > 0) {
      return storedTeachers;
    }
    // Mock teachers if none exist
    return [
      { id: 1, name: 'Dr. Sharma', email: 'sharma@uni.edu', department: 'Computer Science' },
      { id: 2, name: 'Prof. Gupta', email: 'gupta@uni.edu', department: 'Computer Science' },
      { id: 3, name: 'Dr. Patel', email: 'patel@uni.edu', department: 'Electronics' },
      { id: 4, name: 'Prof. Kumar', email: 'kumar@uni.edu', department: 'Mathematics' },
      { id: 5, name: 'Dr. Singh', email: 'singh@uni.edu', department: 'Physics' }
    ];
  });
  
  // State for timetable entries
  const [timetableEntries, setTimetableEntries] = useState(() => {
    const storedEntries = JSON.parse(localStorage.getItem('timetableEntries') || '[]');
    return storedEntries;
  });
  
  // State for new timetable entry
  const [newEntry, setNewEntry] = useState({
    yearId: '',
    subjectId: '',
    teacherId: '',
    day: 'Monday',
    startTime: '09:00',
    endTime: '10:30',
    room: 'A101'
  });
  
  // Days and time slots
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const timeSlots = [
    '08:00-09:30', '09:30-11:00', '11:00-12:30',
    '13:00-14:30', '14:30-16:00', '16:00-17:30'
  ];
  
  // Filter timetable entries by selected year
  const filteredEntries = selectedYear 
    ? timetableEntries.filter(entry => entry.yearId == selectedYear.id)
    : [];
  
  // Load available subjects when year is selected
  useEffect(() => {
    if (selectedYear) {
      const yearSubjects = subjects.filter(subject => subject.yearId == selectedYear.id);
      setAvailableSubjects(yearSubjects);
      setNewEntry(prev => ({ ...prev, yearId: selectedYear.id, subjectId: '' }));
    }
  }, [selectedYear, subjects]);
  
  // Handle year selection
  const handleYearSelect = (year) => {
    setSelectedYear(year);
  };
  
  // Check for conflicts
  const checkConflicts = (entry) => {
    const conflicts = [];
    
    // Check teacher conflict
    const teacherConflict = timetableEntries.find(te => 
      te.teacherId == entry.teacherId && 
      te.day === entry.day &&
      ((entry.startTime >= te.startTime && entry.startTime < te.endTime) ||
       (entry.endTime > te.startTime && entry.endTime <= te.endTime) ||
       (entry.startTime <= te.startTime && entry.endTime >= te.endTime))
    );
    
    if (teacherConflict) {
      conflicts.push(`Teacher is already assigned to ${teacherConflict.subjectName} at this time`);
    }
    
    // Check room conflict
    const roomConflict = timetableEntries.find(te => 
      te.room === entry.room && 
      te.day === entry.day &&
      ((entry.startTime >= te.startTime && entry.startTime < te.endTime) ||
       (entry.endTime > te.startTime && entry.endTime <= te.endTime) ||
       (entry.startTime <= te.startTime && entry.endTime >= te.endTime))
    );
    
    if (roomConflict) {
      conflicts.push(`Room is already occupied by ${roomConflict.subjectName} at this time`);
    }
    
    return conflicts;
  };
  
  // Add new timetable entry
  const handleAddEntry = (e) => {
    e.preventDefault();
    
    if (!newEntry.yearId || !newEntry.subjectId || !newEntry.teacherId) {
      alert('Please fill all required fields');
      return;
    }
    
    const selectedSubject = subjects.find(s => s.id == newEntry.subjectId);
    const selectedTeacher = teachers.find(t => t.id == newEntry.teacherId);
    
    const entry = {
      id: Date.now(),
      yearId: newEntry.yearId,
      yearName: selectedYear?.name,
      subjectId: newEntry.subjectId,
      subjectName: selectedSubject?.name,
      subjectCode: selectedSubject?.code,
      teacherId: newEntry.teacherId,
      teacherName: selectedTeacher?.name,
      day: newEntry.day,
      startTime: newEntry.startTime,
      endTime: newEntry.endTime,
      room: newEntry.room,
      createdAt: new Date().toISOString()
    };
    
    // Check for conflicts
    const conflicts = checkConflicts(entry);
    if (conflicts.length > 0) {
      alert(`Cannot add entry due to conflicts:\n${conflicts.join('\n')}`);
      return;
    }
    
    const updatedEntries = [...timetableEntries, entry];
    setTimetableEntries(updatedEntries);
    localStorage.setItem('timetableEntries', JSON.stringify(updatedEntries));
    
    // Reset form
    setNewEntry({
      yearId: selectedYear?.id || '',
      subjectId: '',
      teacherId: '',
      day: 'Monday',
      startTime: '09:00',
      endTime: '10:30',
      room: 'A101'
    });
    
    alert('Timetable entry added successfully!');
  };
  
  // Delete timetable entry
  const handleDeleteEntry = (id) => {
    if (window.confirm('Are you sure you want to delete this timetable entry?')) {
      const updatedEntries = timetableEntries.filter(entry => entry.id !== id);
      setTimetableEntries(updatedEntries);
      localStorage.setItem('timetableEntries', JSON.stringify(updatedEntries));
      alert('Entry deleted successfully!');
    }
  };
  
  // Edit timetable entry
  const handleEditEntry = (entry) => {
    const newSubject = prompt('Enter new subject (leave empty to keep current):', entry.subjectName);
    const newTeacher = prompt('Enter new teacher (leave empty to keep current):', entry.teacherName);
    const newTime = prompt('Enter new time (format: 09:00-10:30, leave empty to keep current):', 
      `${entry.startTime}-${entry.endTime}`);
    
    if (newSubject !== null || newTeacher !== null || newTime !== null) {
      const updatedEntries = timetableEntries.map(te => {
        if (te.id === entry.id) {
          const updated = { ...te };
          
          if (newSubject && newSubject.trim() !== '') {
            updated.subjectName = newSubject;
          }
          
          if (newTeacher && newTeacher.trim() !== '') {
            updated.teacherName = newTeacher;
          }
          
          if (newTime && newTime.trim() !== '') {
            const [start, end] = newTime.split('-');
            if (start && end) {
              updated.startTime = start.trim();
              updated.endTime = end.trim();
            }
          }
          
          return updated;
        }
        return te;
      });
      
      setTimetableEntries(updatedEntries);
      localStorage.setItem('timetableEntries', JSON.stringify(updatedEntries));
      alert('Entry updated successfully!');
    }
  };
  
  // Publish timetable
  const handlePublishTimetable = () => {
    if (!selectedYear) {
      alert('Please select a year first');
      return;
    }
    
    if (filteredEntries.length === 0) {
      alert('No timetable entries to publish');
      return;
    }
    
    if (window.confirm(`Publish timetable for ${selectedYear.name}? This will make it visible to students and teachers.`)) {
      // In a real app, you would send this to backend
      localStorage.setItem(`publishedTimetable_${selectedYear.id}`, JSON.stringify({
        yearId: selectedYear.id,
        yearName: selectedYear.name,
        entries: filteredEntries,
        publishedAt: new Date().toISOString(),
        publishedBy: 'Admin'
      }));
      
      alert(`Timetable for ${selectedYear.name} published successfully!`);
    }
  };
  
  // Export timetable as CSV
  const handleExportTimetable = () => {
    if (!selectedYear) {
      alert('Please select a year first');
      return;
    }
    
    if (filteredEntries.length === 0) {
      alert('No timetable entries to export');
      return;
    }
    
    // Create CSV content
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Day,Time,Room,Subject,Subject Code,Teacher\n";
    
    filteredEntries.forEach(entry => {
      csvContent += `${entry.day},${entry.startTime}-${entry.endTime},${entry.room},"${entry.subjectName}",${entry.subjectCode},"${entry.teacherName}"\n`;
    });
    
    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `timetable_${selectedYear.code}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // View teacher-wise timetable
  const [showTeacherView, setShowTeacherView] = useState(false);
  
  // Group entries by teacher for teacher view
  const teacherTimetable = {};
  timetableEntries.forEach(entry => {
    if (!teacherTimetable[entry.teacherName]) {
      teacherTimetable[entry.teacherName] = [];
    }
    teacherTimetable[entry.teacherName].push(entry);
  });
  
  return (
    <div className="timetable-container">
      {/* Header */}
      <Header />
      
      {/* Sidebar */}
      <Sidebar />
      <div className="timetable-header">
        <h1>Timetable Management</h1>
        <div className="header-actions">
          <button 
            className="btn btn-primary"
            onClick={handleExportTimetable}
            disabled={!selectedYear || filteredEntries.length === 0}
          >
            Export Timetable
          </button>
          <button 
            className="btn btn-success"
            onClick={handlePublishTimetable}
            disabled={!selectedYear || filteredEntries.length === 0}
          >
            Publish Timetable
          </button>
        </div>
      </div>
      
      {/* Year Selection */}
      <div className="year-selection-section">
        <h2>Select Academic Year</h2>
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
        
        {selectedYear && (
          <div className="year-info">
            <h3>Selected: {selectedYear.name}</h3>
            <p>
              Total Subjects: {availableSubjects.length} | 
              Timetable Entries: {filteredEntries.length} | 
              Published: {localStorage.getItem(`publishedTimetable_${selectedYear.id}`) ? 'Yes' : 'No'}
            </p>
          </div>
        )}
      </div>
      
      {/* View Toggle */}
      <div className="view-toggle">
        <button
          className={`view-btn ${!showTeacherView ? 'active' : ''}`}
          onClick={() => setShowTeacherView(false)}
        >
          Year-wise View
        </button>
        <button
          className={`view-btn ${showTeacherView ? 'active' : ''}`}
          onClick={() => setShowTeacherView(true)}
        >
          Teacher-wise View
        </button>
      </div>
      
      {selectedYear ? (
        <>
          {!showTeacherView ? (
            /* Year-wise Timetable View */
            <div className="timetable-content">
              {/* Add New Entry Form */}
              <div className="add-entry-form">
                <h3>Add New Timetable Entry</h3>
                <form onSubmit={handleAddEntry}>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Subject *</label>
                      <select
                        value={newEntry.subjectId}
                        onChange={(e) => setNewEntry({...newEntry, subjectId: e.target.value})}
                        required
                      >
                        <option value="">Select Subject</option>
                        {availableSubjects.map(subject => (
                          <option key={subject.id} value={subject.id}>
                            {subject.name} ({subject.code})
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label>Teacher *</label>
                      <select
                        value={newEntry.teacherId}
                        onChange={(e) => setNewEntry({...newEntry, teacherId: e.target.value})}
                        required
                      >
                        <option value="">Select Teacher</option>
                        {teachers.map(teacher => (
                          <option key={teacher.id} value={teacher.id}>
                            {teacher.name} ({teacher.department})
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label>Day *</label>
                      <select
                        value={newEntry.day}
                        onChange={(e) => setNewEntry({...newEntry, day: e.target.value})}
                      >
                        {days.map(day => (
                          <option key={day} value={day}>{day}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label>Start Time *</label>
                      <input
                        type="time"
                        value={newEntry.startTime}
                        onChange={(e) => setNewEntry({...newEntry, startTime: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>End Time *</label>
                      <input
                        type="time"
                        value={newEntry.endTime}
                        onChange={(e) => setNewEntry({...newEntry, endTime: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Room</label>
                      <input
                        type="text"
                        value={newEntry.room}
                        onChange={(e) => setNewEntry({...newEntry, room: e.target.value})}
                        placeholder="e.g., A101"
                      />
                    </div>
                  </div>
                  
                  <div className="form-actions">
                    <button type="submit" className="btn btn-primary">
                      Add to Timetable
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-secondary"
                      onClick={() => setNewEntry({
                        yearId: selectedYear.id,
                        subjectId: '',
                        teacherId: '',
                        day: 'Monday',
                        startTime: '09:00',
                        endTime: '10:30',
                        room: 'A101'
                      })}
                    >
                      Reset
                    </button>
                  </div>
                </form>
              </div>
              
              {/* Timetable Display */}
              <div className="timetable-display">
                <h3>Timetable for {selectedYear.name}</h3>
                
                {filteredEntries.length === 0 ? (
                  <div className="empty-state">
                    <p>No timetable entries yet. Add your first entry above.</p>
                  </div>
                ) : (
                  <div className="timetable-table">
                    <table>
                      <thead>
                        <tr>
                          <th>Day</th>
                          <th>Time</th>
                          <th>Room</th>
                          <th>Subject</th>
                          <th>Teacher</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredEntries
                          .sort((a, b) => {
                            // Sort by day index then by start time
                            const dayOrder = {Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6};
                            if (dayOrder[a.day] !== dayOrder[b.day]) {
                              return dayOrder[a.day] - dayOrder[b.day];
                            }
                            return a.startTime.localeCompare(b.startTime);
                          })
                          .map(entry => (
                            <tr key={entry.id}>
                              <td>{entry.day}</td>
                              <td>{entry.startTime} - {entry.endTime}</td>
                              <td>{entry.room}</td>
                              <td>
                                <strong>{entry.subjectName}</strong>
                                <br />
                                <small>{entry.subjectCode}</small>
                              </td>
                              <td>{entry.teacherName}</td>
                              <td className="actions">
                                <button 
                                  className="btn-edit"
                                  onClick={() => handleEditEntry(entry)}
                                >
                                  Edit
                                </button>
                                <button 
                                  className="btn-delete"
                                  onClick={() => handleDeleteEntry(entry.id)}
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}
                
                {/* Visual Timetable Grid */}
                {filteredEntries.length > 0 && (
                  <div className="visual-timetable">
                    <h4>Visual Schedule</h4>
                    <div className="timetable-grid">
                      <div className="grid-header">
                        <div className="time-label">Time</div>
                        {days.map(day => (
                          <div key={day} className="day-header">{day}</div>
                        ))}
                      </div>
                      
                      {timeSlots.map(slot => {
                        const [slotStart, slotEnd] = slot.split('-');
                        return (
                          <div key={slot} className="time-row">
                            <div className="time-label">{slot}</div>
                            {days.map(day => {
                              const entry = filteredEntries.find(e => 
                                e.day === day &&
                                e.startTime === slotStart &&
                                e.endTime === slotEnd
                              );
                              
                              return (
                                <div key={`${day}-${slot}`} className="time-cell">
                                  {entry ? (
                                    <div className="lecture-slot">
                                      <strong>{entry.subjectCode}</strong>
                                      <small>{entry.teacherName}</small>
                                      <small>{entry.room}</small>
                                    </div>
                                  ) : (
                                    <div className="empty-slot">Free</div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Teacher-wise View */
            <div className="teacher-timetable-view">
              <h3>Teacher-wise Timetable</h3>
              
              {Object.keys(teacherTimetable).length === 0 ? (
                <div className="empty-state">
                  <p>No teacher assignments yet. Add timetable entries first.</p>
                </div>
              ) : (
                <div className="teacher-cards">
                  {Object.entries(teacherTimetable).map(([teacherName, entries]) => (
                    <div key={teacherName} className="teacher-card">
                      <div className="teacher-header">
                        <h4>{teacherName}</h4>
                        <span className="lecture-count">{entries.length} lectures</span>
                      </div>
                      
                      <div className="teacher-schedule">
                        <table>
                          <thead>
                            <tr>
                              <th>Day</th>
                              <th>Time</th>
                              <th>Subject</th>
                              <th>Year</th>
                              <th>Room</th>
                            </tr>
                          </thead>
                          <tbody>
                            {entries
                              .sort((a, b) => {
                                const dayOrder = {Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6};
                                if (dayOrder[a.day] !== dayOrder[b.day]) {
                                  return dayOrder[a.day] - dayOrder[b.day];
                                }
                                return a.startTime.localeCompare(b.startTime);
                              })
                              .map(entry => (
                                <tr key={entry.id}>
                                  <td>{entry.day}</td>
                                  <td>{entry.startTime}-{entry.endTime}</td>
                                  <td>{entry.subjectName}</td>
                                  <td>{entry.yearName}</td>
                                  <td>{entry.room}</td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        /* No Year Selected */
        <div className="no-selection">
          <div className="empty-state">
            <h3>Welcome to Timetable Management</h3>
            <p>Please select an academic year to start managing the timetable.</p>
            <div className="instructions">
              <h4>How to use:</h4>
              <ol>
                <li>Select an academic year from above</li>
                <li>Add subjects to the selected year</li>
                <li>Assign teachers to subjects</li>
                <li>Set day, time, and room for each lecture</li>
                <li>Review and publish the timetable</li>
              </ol>
            </div>
          </div>
        </div>
      )}
      
      {/* Quick Stats */}
      {selectedYear && (
        <div className="quick-stats">
          <div className="stat-card">
            <h4>Total Entries</h4>
            <p className="stat-number">{filteredEntries.length}</p>
          </div>
          <div className="stat-card">
            <h4>Assigned Teachers</h4>
            <p className="stat-number">
              {[...new Set(filteredEntries.map(e => e.teacherName))].length}
            </p>
          </div>
          <div className="stat-card">
            <h4>Days Covered</h4>
            <p className="stat-number">
              {[...new Set(filteredEntries.map(e => e.day))].length}
            </p>
          </div>
          <div className="stat-card">
            <h4>Rooms Used</h4>
            <p className="stat-number">
              {[...new Set(filteredEntries.map(e => e.room))].length}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Timetable;