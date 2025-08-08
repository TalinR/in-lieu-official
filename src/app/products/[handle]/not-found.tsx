import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="mx-auto max-w-7xl px-4 pt-20">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Product Not Found</h1>
        <p className="text-gray-600 mb-8">
          Sorry, we couldn't find the product you're looking for.
        </p>
        <Link
          href="/"
          className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-black hover:bg-gray-800 transition-colors"
        >
          Return Home
        </Link>
      </div>
    </main>
  );
}

