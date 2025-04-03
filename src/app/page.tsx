import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8">
      <main className="text-center bg-white p-10 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Welcome</h1>
        <p className="text-gray-600 mb-8">
          Navigate to the section you want to visit:
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/admin">
            <span className="block w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors cursor-pointer text-center font-medium">
              Go to Admin Panel
            </span>
          </Link>
          <Link href="/profiles">
            <span className="block w-full sm:w-auto px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors cursor-pointer text-center font-medium">
              Go to Profiles
            </span>
          </Link>
        </div>
      </main>
      <footer className="mt-8 text-gray-500 text-sm">
        Profile Management System
      </footer>
    </div>
  );
}
