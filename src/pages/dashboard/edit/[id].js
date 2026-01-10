import { useRouter } from 'next/router';
import EmployeeForm from '@/components/employees/EmployeeForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

export default function EditEmployee() {
  const router = useRouter();
  const { id } = router.query;

  if (!id) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <FontAwesomeIcon icon={faSpinner} spin className="text-4xl text-indigo-600 mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return <EmployeeForm employeeId={id} isEdit={true} />;
}