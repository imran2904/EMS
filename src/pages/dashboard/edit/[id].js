import { useRouter } from 'next/router';
import EmployeeForm from '@/components/employees/EmployeeForm';

export default function EditEmployee() {
  const router = useRouter();
  const { id } = router.query;

  if (!id) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-indigo-600 mb-4"></i>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return <EmployeeForm employeeId={id} isEdit={true} />;
}