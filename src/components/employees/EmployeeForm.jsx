import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserEdit, faUserPlus, faUser, faUpload, faSpinner, faSave, faPlus } from '@fortawesome/free-solid-svg-icons';
import { STATES, GENDER_OPTIONS } from '@/lib/constants';
import { addEmployee, updateEmployee, getEmployeeById } from '@/lib/storage';
import { convertImageToBase64, showToast } from '@/lib/utils';

export default function EmployeeForm({ employeeId = null, isEdit = false }) {
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm({
    defaultValues: {
      fullName: '',
      gender: '',
      dob: '',
      state: '',
      isActive: true
    }
  });

  // Load employee data for edit mode
  useEffect(() => {
    if (isEdit && employeeId) {
      const employee = getEmployeeById(employeeId);
      if (employee) {
        reset({
          fullName: employee.fullName,
          gender: employee.gender,
          dob: employee.dob,
          state: employee.state,
          isActive: employee.isActive
        });
        setImagePreview(employee.profileImage);
      } else {
        showToast('Employee not found', 'error');
        router.push('/dashboard');
      }
    }
  }, [isEdit, employeeId, reset, router]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        showToast('Image size should be less than 5MB', 'error');
        return;
      }

      if (!file.type.startsWith('image/')) {
        showToast('Please select a valid image file', 'error');
        return;
      }

      try {
        const base64 = await convertImageToBase64(file);
        setImagePreview(base64);
      } catch (error) {
        showToast('Error processing image', 'error');
      }
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);

    // Validate image for new employee
    if (!isEdit && !imagePreview) {
      showToast('Profile image is required', 'error');
      setIsLoading(false);
      return;
    }

    try {
      const employeeData = {
        ...data,
        profileImage: imagePreview || (isEdit ? getEmployeeById(employeeId)?.profileImage : '')
      };

      if (isEdit) {
        updateEmployee(employeeId, employeeData);
        showToast('Employee updated successfully!', 'success');
      } else {
        addEmployee(employeeData);
        showToast('Employee added successfully!', 'success');
      }

      router.push('/dashboard');
    } catch (error) {
      showToast('Error saving employee', 'error');
    }

    setIsLoading(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <FontAwesomeIcon icon={isEdit ? faUserEdit : faUserPlus} className="mr-3 text-indigo-600" />
          {isEdit ? 'Edit Employee' : 'Add New Employee'}
        </h2>
        <p className="text-gray-600 mt-2">
          {isEdit ? 'Update employee information' : 'Fill in the details to add a new employee'}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Profile Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Profile Image {!isEdit && <span className="text-red-500">*</span>}
          </label>
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Profile preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <FontAwesomeIcon icon={faUser} className="text-gray-400 text-2xl" />
              )}
            </div>
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="profileImage"
              />
              <label
                htmlFor="profileImage"
                className="cursor-pointer bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <FontAwesomeIcon icon={faUpload} className="mr-2" />
                {imagePreview ? 'Change Image' : 'Upload Image'}
              </label>
              <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
            </div>
          </div>
        </div>

        {/* Full Name */}
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            {...register('fullName', {
              required: 'Full name is required',
              minLength: {
                value: 3,
                message: 'Full name must be at least 3 characters'
              }
            })}
            type="text"
            id="fullName"
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-gray-900 bg-white placeholder-gray-500"
            placeholder="Enter full name"
          />
          {errors.fullName && (
            <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
          )}
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gender <span className="text-red-500">*</span>
          </label>
          <div className="flex space-x-6">
            {GENDER_OPTIONS.map((option) => (
              <label key={option.value} className="flex items-center">
                <input
                  {...register('gender', { required: 'Gender is required' })}
                  type="radio"
                  value={option.value}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
          {errors.gender && (
            <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>
          )}
        </div>

        {/* Date of Birth */}
        <div>
          <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-2">
            Date of Birth <span className="text-red-500">*</span>
          </label>
          <input
            {...register('dob', { required: 'Date of birth is required' })}
            type="date"
            id="dob"
            max={new Date().toISOString().split('T')[0]}
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-gray-900 bg-white"
          />
          {errors.dob && (
            <p className="mt-1 text-sm text-red-600">{errors.dob.message}</p>
          )}
        </div>

        {/* State */}
        <div>
          <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
            State <span className="text-red-500">*</span>
          </label>
          <select
            {...register('state', { required: 'State is required' })}
            id="state"
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-gray-900 bg-white"
          >
            <option value="">Select a state</option>
            {STATES.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
          {errors.state && (
            <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>
          )}
        </div>

        {/* Active Status */}
        <div>
          <label className="flex items-center">
            <input
              {...register('isActive')}
              type="checkbox"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">Active Employee</span>
          </label>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => router.push('/dashboard')}
            className="px-3 sm:px-6 py-2 text-sm sm:text-base border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-3 sm:px-6 text-sm sm:text-base py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center">
                <FontAwesomeIcon icon={faSpinner} className="mr-2 animate-spin" />
                {isEdit ? 'Updating...' : 'Adding...'}
              </div>
            ) : (
              <>
                <FontAwesomeIcon icon={isEdit ? faSave : faPlus} className="mr-2" />
                {isEdit ? 'Update Employee' : 'Add Employee'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}