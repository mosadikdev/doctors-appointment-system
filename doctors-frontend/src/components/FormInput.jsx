import { ExclamationCircleIcon } from "@heroicons/react/24/outline";

export default function FormInput({
  label,
  name,
  type = "text",
  value,
  onChange,
  required = false,
  icon,
  error,
}) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-600">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        
        <input
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          required={required}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            icon ? "pl-10" : ""
          } ${error ? "border-red-500" : "border-gray-300"}`}
        />
        
        {error && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-red-600 mt-1">{error}</p>
      )}
    </div>
  );
}