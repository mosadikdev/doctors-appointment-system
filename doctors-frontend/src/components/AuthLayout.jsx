export default function AuthLayout({ 
  title, 
  subtitle,
  children,
  footerText,
  footerLink,
  footerLinkText
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {title}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {subtitle}
          </p>
        </div>

        {children}

        {footerText && (
          <p className="mt-8 text-center text-sm text-gray-600">
            {footerText}{' '}
            <a 
              href={footerLink} 
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              {footerLinkText}
            </a>
          </p>
        )}
      </div>
    </div>
  );
}