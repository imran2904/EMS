// LocalStorage helper functions for employee management

export const STORAGE_KEYS = {
  AUTH: 'auth',
  EMPLOYEES: 'employees'
};

// Authentication helpers
export const setAuth = (isAuthenticated) => {
  localStorage.setItem(STORAGE_KEYS.AUTH, isAuthenticated.toString());
};

export const getAuth = () => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(STORAGE_KEYS.AUTH) === 'true';
};

export const clearAuth = () => {
  localStorage.removeItem(STORAGE_KEYS.AUTH);
};

// Employee helpers
export const getEmployees = () => {
  if (typeof window === 'undefined') return [];
  const employees = localStorage.getItem(STORAGE_KEYS.EMPLOYEES);
  return employees ? JSON.parse(employees) : [];
};

export const setEmployees = (employees) => {
  try {
    const data = JSON.stringify(employees);
    
    // Check if data is too large for localStorage
    if (data.length > 5000000) { // ~5MB limit
      throw new Error('Data too large for storage. Try using smaller images.');
    }
    
    localStorage.setItem(STORAGE_KEYS.EMPLOYEES, data);
    console.log('Employees saved to localStorage successfully');
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    if (error.name === 'QuotaExceededError') {
      throw new Error('Storage quota exceeded. Try using smaller images or clear some data.');
    }
    throw error;
  }
};

export const addEmployee = (employee) => {
  try {
    const employees = getEmployees();
    const newEmployee = {
      ...employee,
      id: generateEmployeeId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    console.log('Adding new employee:', newEmployee);
    
    employees.push(newEmployee);
    setEmployees(employees);
    
    console.log('Employee added successfully');
    return newEmployee;
  } catch (error) {
    console.error('Error in addEmployee:', error);
    throw new Error(`Failed to add employee: ${error.message}`);
  }
};

export const updateEmployee = (id, updatedData) => {
  const employees = getEmployees();
  const index = employees.findIndex(emp => emp.id === id);
  if (index !== -1) {
    employees[index] = {
      ...employees[index],
      ...updatedData,
      updatedAt: new Date().toISOString()
    };
    setEmployees(employees);
    return employees[index];
  }
  return null;
};

export const deleteEmployee = (id) => {
  const employees = getEmployees();
  const filteredEmployees = employees.filter(emp => emp.id !== id);
  setEmployees(filteredEmployees);
  return true;
};

export const getEmployeeById = (id) => {
  const employees = getEmployees();
  return employees.find(emp => emp.id === id) || null;
};

// Generate unique employee ID
const generateEmployeeId = () => {
  try {
    const employees = getEmployees();
    const lastId = employees.length > 0 
      ? Math.max(...employees.map(emp => {
          const idNum = parseInt(emp.id.split('-')[1]);
          return isNaN(idNum) ? 0 : idNum;
        })) 
      : 0;
    const newId = `EMP-${String(lastId + 1).padStart(4, '0')}`;
    console.log('Generated new employee ID:', newId);
    return newId;
  } catch (error) {
    console.error('Error generating employee ID:', error);
    // Fallback to timestamp-based ID
    return `EMP-${Date.now()}`;
  }
};

// Seed initial data
export const seedEmployees = () => {
  const existingEmployees = getEmployees();
  if (existingEmployees.length === 0) {
    const mockEmployees = [
      {
        id: 'EMP-0001',
        profileImage: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiM2MzY2RjEiLz4KPHN2ZyB4PSI4IiB5PSI4IiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSI+CjxwYXRoIGQ9Ik0yMCAyMXYtMmE0IDQgMCAwIDAtNC00SDhhNCA0IDAgMCAwLTQgNHYyIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8Y2lyY2xlIGN4PSIxMiIgY3k9IjciIHI9IjQiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo8L3N2Zz4K',
        fullName: 'John Doe',
        gender: 'Male',
        dob: '1990-05-15',
        state: 'California',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'EMP-0002',
        profileImage: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNGNTY1NjUiLz4KPHN2ZyB4PSI4IiB5PSI4IiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSI+CjxwYXRoIGQ9Ik0yMCAyMXYtMmE0IDQgMCAwIDAtNC00SDhhNCA0IDAgMCAwLTQgNHYyIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8Y2lyY2xlIGN4PSIxMiIgY3k9IjciIHI9IjQiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo8L3N2Zz4K',
        fullName: 'Jane Smith',
        gender: 'Female',
        dob: '1988-12-03',
        state: 'New York',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'EMP-0003',
        profileImage: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiMxMEI5ODEiLz4KPHN2ZyB4PSI4IiB5PSI4IiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSI+CjxwYXRoIGQ9Ik0yMCAyMXYtMmE0IDQgMCAwIDAtNC00SDhhNCA0IDAgMCAwLTQgNHYyIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8Y2lyY2xlIGN4PSIxMiIgY3k9IjciIHI9IjQiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo8L3N2Zz4K',
        fullName: 'Mike Johnson',
        gender: 'Male',
        dob: '1992-08-20',
        state: 'Texas',
        isActive: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'EMP-0004',
        profileImage: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNGNTk5MjgiLz4KPHN2ZyB4PSI4IiB5PSI4IiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSI+CjxwYXRoIGQ9Ik0yMCAyMXYtMmE0IDQgMCAwIDAtNC00SDhhNCA0IDAgMCAwLTQgNHYyIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8Y2lyY2xlIGN4PSIxMiIgY3k9IjciIHI9IjQiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo8L3N2Zz4K',
        fullName: 'Sarah Wilson',
        gender: 'Female',
        dob: '1985-03-10',
        state: 'Florida',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'EMP-0005',
        profileImage: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiM4QjVDRjYiLz4KPHN2ZyB4PSI4IiB5PSI4IiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSI+CjxwYXRoIGQ9Ik0yMCAyMXYtMmE0IDQgMCAwIDAtNC00SDhhNCA0IDAgMCAwLTQgNHYyIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8Y2lyY2xlIGN4PSIxMiIgY3k9IjciIHI9IjQiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo8L3N2Zz4K',
        fullName: 'David Brown',
        gender: 'Male',
        dob: '1993-11-25',
        state: 'Illinois',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    setEmployees(mockEmployees);
  }
};