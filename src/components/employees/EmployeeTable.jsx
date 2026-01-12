import { useState } from 'react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faEdit, faTrash, faPrint, faPlus } from '@fortawesome/free-solid-svg-icons';

export default function EmployeeTable({
  employees,
  onDelete,
  onToggleStatus,
  searchTerm,
  genderFilter,
  statusFilter
}) {
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, employee: null });

  const handleDeleteClick = (employee) => {
    setDeleteModal({ isOpen: true, employee });
  };

  const handleDeleteConfirm = () => {
    if (deleteModal.employee) {
      onDelete(deleteModal.employee.id);
      setDeleteModal({ isOpen: false, employee: null });
    }
  };

  const handlePrintEmployee = (employee) => {
    const printWindow = window.open('', '_blank');
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Employee Details - ${employee.fullName}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .employee-card { border: 1px solid #ddd; padding: 20px; border-radius: 8px; }
            .profile-img { width: 100px; height: 100px; border-radius: 50%; object-fit: cover; margin: 0 auto 20px; display: block; }
            .info-row { display: flex; justify-content: space-between; margin-bottom: 10px; padding: 8px 0; border-bottom: 1px solid #eee; }
            .label { font-weight: bold; }
            .status { padding: 4px 12px; border-radius: 20px; font-size: 12px; }
            .active { background-color: #d1fae5; color: #065f46; }
            .inactive { background-color: #fee2e2; color: #991b1b; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Employee Details</h1>
            <p>Generated on ${new Date().toLocaleDateString()}</p>
          </div>
          <div class="employee-card">
            <img src="${employee.profileImage}" alt="${employee.fullName}" class="profile-img" />
            <div class="info-row">
              <span class="label">Employee ID:</span>
              <span>${employee.id}</span>
            </div>
            <div class="info-row">
              <span class="label">Full Name:</span>
              <span>${employee.fullName}</span>
            </div>
            <div class="info-row">
              <span class="label">Gender:</span>
              <span>${employee.gender}</span>
            </div>
            <div class="info-row">
              <span class="label">Date of Birth:</span>
              <span>${formatDate(employee.dob)}</span>
            </div>
            <div class="info-row">
              <span class="label">State:</span>
              <span>${employee.state}</span>
            </div>
            <div class="info-row">
              <span class="label">Status:</span>
              <span class="status ${employee.isActive ? 'active' : 'inactive'}">
                ${employee.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div class="info-row">
              <span class="label">Created:</span>
              <span>${formatDate(employee.createdAt)}</span>
            </div>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  // Filter employees
  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.fullName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGender = genderFilter === 'All' || employee.gender === genderFilter;
    const matchesStatus = statusFilter === 'All' ||
      (statusFilter === 'Active' && employee.isActive) ||
      (statusFilter === 'Inactive' && !employee.isActive);

    return matchesSearch && matchesGender && matchesStatus;
  });

  if (filteredEmployees.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <FontAwesomeIcon 
          icon={faUsers} 
          className="text-gray-300 mb-4" 
          style={{ width: '64px', height: '64px' }}
        />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No employees found</h3>
        <p className="text-gray-500 mb-4">
          {employees.length === 0
            ? "Get started by adding your first employee."
            : "Try adjusting your search or filter criteria."
          }
        </p>
        {employees.length === 0 && (
          <Link
            href="/dashboard/add"
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <FontAwesomeIcon 
              icon={faPlus} 
              className="mr-2" 
              style={{ width: '16px', height: '16px' }}
            />
            Add Employee
          </Link>
        )}
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full text-nowrap divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Employee
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Gender
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date of Birth
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                State
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredEmployees.map((employee) => (
              <tr key={employee.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <img
                        className="h-10 w-10 rounded-full object-cover"
                        src={employee.profileImage}
                        alt={employee.fullName}
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {employee.fullName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {employee.id}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {employee.gender}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {formatDate(employee.dob)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {employee.state}
                </td>
                <td className="px-6 py-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={employee.isActive}
                      onChange={() => onToggleStatus(employee.id)}
                      className="sr-only"
                    />
                    <div className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      employee.isActive ? 'bg-indigo-600' : 'bg-gray-200'
                    }`}>
                      <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        employee.isActive ? 'translate-x-5' : 'translate-x-1'
                      }`} />
                    </div>
                    <span className={`ml-2 text-sm ${
                      employee.isActive ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {employee.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </label>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <Link
                      href={`/dashboard/edit/${employee.id}`}
                      className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50"
                      title="Edit Employee"
                    >
                      <FontAwesomeIcon 
                        icon={faEdit} 
                        style={{ width: '16px', height: '16px' }}
                      />
                    </Link>
                    <button
                      onClick={() => handleDeleteClick(employee)}
                      className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                      title="Delete Employee"
                    >
                      <FontAwesomeIcon 
                        icon={faTrash} 
                        style={{ width: '16px', height: '16px' }}
                      />
                    </button>
                    <button
                      onClick={() => handlePrintEmployee(employee)}
                      className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-50"
                      title="Print Employee"
                    >
                      <FontAwesomeIcon 
                        icon={faPrint} 
                        style={{ width: '16px', height: '16px' }}
                      />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {filteredEmployees.map((employee) => (
          <div key={employee.id} className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center space-x-3 mb-3">
              <img
                className="h-12 w-12 rounded-full object-cover"
                src={employee.profileImage}
                alt={employee.fullName}
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900 truncate">
                  {employee.fullName}
                </h3>
                <p className="text-xs text-gray-500">{employee.id}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Link
                  href={`/dashboard/edit/${employee.id}`}
                  className="text-indigo-600 hover:text-indigo-900 p-2 rounded hover:bg-indigo-50"
                >
                  <FontAwesomeIcon 
                    icon={faEdit} 
                    style={{ width: '16px', height: '16px' }}
                  />
                </Link>
                <button
                  onClick={() => handleDeleteClick(employee)}
                  className="text-red-600 hover:text-red-900 p-2 rounded hover:bg-red-50"
                >
                  <FontAwesomeIcon 
                    icon={faTrash} 
                    style={{ width: '16px', height: '16px' }}
                  />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-500">Gender:</span>
                <span className="ml-1 text-gray-900">{employee.gender}</span>
              </div>
              <div>
                <span className="text-gray-500">DOB:</span>
                <span className="ml-1 text-gray-900">{formatDate(employee.dob)}</span>
              </div>
              <div>
                <span className="text-gray-500">State:</span>
                <span className="ml-1 text-gray-900">{employee.state}</span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-500 mr-2">Status:</span>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={employee.isActive}
                    onChange={() => onToggleStatus(employee.id)}
                    className="sr-only"
                  />
                  <div className={`relative inline-flex h-4 w-7 items-center rounded-full transition-colors ${
                    employee.isActive ? 'bg-indigo-600' : 'bg-gray-200'
                  }`}>
                    <span className={`inline-block h-2 w-2 transform rounded-full bg-white transition-transform ${
                      employee.isActive ? 'translate-x-4' : 'translate-x-1'
                    }`} />
                  </div>
                  <span className={`ml-1 text-xs ${
                    employee.isActive ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {employee.isActive ? 'Active' : 'Inactive'}
                  </span>
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, employee: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Employee"
        message={`Are you sure you want to delete ${deleteModal.employee?.fullName}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </>
  );
}