"use client";

import Link from "next/link";

function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-800">404</h1>
        <p className="mt-4 text-2xl font-semibold text-gray-600">
          Oops! Page not found
        </p>
        <p className="mt-2 text-gray-500">
          Sorry, we couldn&apos;t find the page you&apos;re looking for.
        </p>
        <Link href="/">
          <a className="mt-6 inline-block bg-blue-600 text-white py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 transition duration-300">
            Go back to Home
          </a>
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;
