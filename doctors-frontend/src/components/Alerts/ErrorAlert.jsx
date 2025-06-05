import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function ErrorAlert({ message }) {
  return (
    <div className="rounded-md bg-red-50 p-4 mb-4">
      <div className="flex items-center">
        <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
        <p className="ml-3 text-sm font-medium text-red-700">{message}</p>
      </div>
    </div>
  );
}