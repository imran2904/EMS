import { useState, useEffect } from 'react';
import Link from 'next/link';
import EmployeeTable from '@/components/employees/EmployeeTable';
import { getEmployees, deleteEmployee, updateEmployee, seedEmployees } from '@/lib/storage';
import { showToast } from '@/lib/utils';
import { GENDER_OPTIONS } from '@/lib/constants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faUserCheck, faUserTimes, faPrint, faPlus, faSearch, faSpinner } from '@fortawesome/free-solid-svg-icons';

export default function Dashboard() {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [genderFilter, setGenderFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Seed employees on first load
    seedEmployees();
    loadEmployees();
  }, []);

  const loadEmployees = () => {
    setIsLoading(true);
    const employeeData = getEmployees();
    setEmployees(employeeData);
    setIsLoading(false);
  };

  const handleDeleteEmployee = (employeeId) => {
    deleteEmployee(employeeId);
    loadEmployees();
    showToast('Employee deleted successfully', 'success');
  };

  const handleToggleStatus = (employeeId) => {
    const employee = employees.find(emp => emp.id === employeeId);
    if (employee) {
      updateEmployee(employeeId, { isActive: !employee.isActive });
      loadEmployees();
      showToast(`Employee ${!employee.isActive ? 'activated' : 'deactivated'} successfully`, 'success');
    }
  };

  const handlePrintEmployees = () => {
    const filteredEmployees = employees.filter(employee => {
      const matchesSearch = employee.fullName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGender = genderFilter === 'All' || employee.gender === genderFilter;
      const matchesStatus = statusFilter === 'All' || 
        (statusFilter === 'Active' && employee.isActive) ||
        (statusFilter === 'Inactive' && !employee.isActive);
      
      return matchesSearch && matchesGender && matchesStatus;
    });

    const printWindow = window.open('', '_blank');
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Employee List</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; }
            .profile-img { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; }
            .status { padding: 4px 8px; border-radius: 12px; font-size: 12px; }
            .active { background-color: #d1fae5; color: #065f46; }
            .inactive { background-color: #fee2e2; color: #991b1b; }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Employee Management System</h1>
            <h2>Employee List</h2>
            <p>Generated on ${new Date().toLocaleDateString()}</p>
            <p>Total Employees: ${filteredEmployees.length}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Profile</th>
                <th>Full Name</th>
                <th>Gender</th>
                <th>Date of Birth</th>
                <th>State</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${filteredEmployees.map(employee => `
                <tr>
                  <td>${employee.id}</td>
                  <td><img src="${employee.profileImage}" alt="${employee.fullName}" class="profile-img" /></td>
                  <td>${employee.fullName}</td>
                  <td>${employee.gender}</td>
                  <td>${new Date(employee.dob).toLocaleDateString()}</td>
                  <td>${employee.state}</td>
                  <td><span class="status ${employee.isActive ? 'active' : 'inactive'}">${employee.isActive ? 'Active' : 'Inactive'}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;
    
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(emp => emp.isActive).length;
  const inactiveEmployees = totalEmployees - activeEmployees;

  if (isLoading) {
    return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <FontAwesomeIcon icon={faSpinner} spin className="text-4xl text-indigo-600 mb-4" />
            <p className="text-gray-600">Loading employees...</p>
          </div>
        </div>
    );
  }

  return (
      <div className="h-full w-full flex flex-col space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-md p-3 lg:p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <FontAwesomeIcon icon={faUsers} className="text-2xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Employees</p>
                <p className="text-2xl font-bold text-gray-900">{totalEmployees}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-3 lg:p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <FontAwesomeIcon icon={faUserCheck} className="text-2xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Employees</p>
                <p className="text-2xl font-bold text-gray-900">{activeEmployees}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-3 lg:p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100 text-red-600">
                <FontAwesomeIcon icon={faUserTimes} className="text-2xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Inactive Employees</p>
                <p className="text-2xl font-bold text-gray-900">{inactiveEmployees}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Employee Management Section */}
        <div className="bg-white w-full rounded-lg shadow-md p-6 flex-1 flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 flex-shrink-0">
            <h2 className="text-xl font-bold text-gray-900 mb-4 sm:mb-0">
              Employee Management
            </h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handlePrintEmployees}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <FontAwesomeIcon icon={faPrint} className="mr-2" />
                Print Employees
              </button>
              <Link
                href="/dashboard/add"
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                Add Employee
              </Link>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 flex-shrink-0">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Search by Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-gray-900 bg-white placeholder-gray-500"
                  placeholder="Search employees..."
                />
              </div>
            </div>

            <div>
              <label htmlFor="genderFilter" className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Gender
              </label>
              <select
                id="genderFilter"
                value={genderFilter}
                onChange={(e) => setGenderFilter(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-gray-900 bg-white"
              >
                <option value="All">All Genders</option>
                {GENDER_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Status
              </label>
              <select
                id="statusFilter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-gray-900 bg-white"
                style={{ border: '1px solid #d1d5db', borderRadius: '8px' }}
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Employee Table */}
            <EmployeeTable
              employees={employees}
              onDelete={handleDeleteEmployee}
              onToggleStatus={handleToggleStatus}
              searchTerm={searchTerm}
              genderFilter={genderFilter}
              statusFilter={statusFilter}
            />
            
        </div>
      </div>
  );
}