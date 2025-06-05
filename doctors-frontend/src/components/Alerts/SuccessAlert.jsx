import { CheckCircleIcon } from '@heroicons/react/24/outline';

export default function SuccessAlert({ message }) {
  return (
    <div className="rounded-md bg-green-50 p-4 mb-4">
      <div className="flex items-center">
        <CheckCircleIcon className="h-5 w-5 text-green-400" />
        <p className="ml-3 text-sm font-medium text-green-700">{message}</p>
      </div>
    </div>
  );
}