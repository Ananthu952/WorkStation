import { Link } from "react-router-dom";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-6">
        <Compass className="w-8 h-8 text-blue-600" />
      </div>
      <h1 className="text-5xl font-bold text-gray-900 mb-2">404</h1>
      <p className="text-gray-500 max-w-[380px] mb-8">
        The page you&apos;re looking for doesn&apos;t exist or may have been moved.
      </p>
      <Link
        to="/"
        className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-all"
      >
        Back to Home
      </Link>
    </div>
  );
}