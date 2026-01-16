// services/authService.js
const authService = {
  // Simulate login
  login: async (email, password) => {
    // Demo credentials
    const demoUsers = {
      'admin@college.edu': { password: 'admin123', role: 'admin', name: 'Admin User' },
      'teacher@college.edu': { password: 'teacher123', role: 'teacher', name: 'Teacher User' },
      'student@college.edu': { password: 'student123', role: 'student', name: 'Student User' }
    };

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (demoUsers[email] && demoUsers[email].password === password) {
      const user = demoUsers[email];
      const token = 'demo-token-' + Date.now();
      
      // Save to localStorage
      localStorage.setItem('authToken', token);
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userName', user.name);
      localStorage.setItem('userRole', user.role);
      localStorage.setItem('isLoggedIn', 'true');

      return {
        success: true,
        token,
        user: {
          email,
          name: user.name,
          role: user.role
        }
      };
    }

    throw new Error('Invalid email or password');
  },

  // Get current user
  getCurrentUser: () => {
    const token = localStorage.getItem('authToken');
    if (!token) return null;

    return {
      email: localStorage.getItem('userEmail'),
      name: localStorage.getItem('userName'),
      role: localStorage.getItem('userRole')
    };
  },

  // Logout
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    localStorage.removeItem('isLoggedIn');
  },

  // Check if authenticated
  isAuthenticated: () => {
    return localStorage.getItem('isLoggedIn') === 'true';
  }
};

export default authService;