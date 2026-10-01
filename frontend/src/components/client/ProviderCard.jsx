import { Star, ShieldCheck } from "lucide-react";

export default function ProviderCard({ name, profession, rating, jobsCompleted }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col items-center text-center hover:shadow-md transition-shadow">
      <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-lg mb-3">
        {initials}
      </div>
      <p className="font-semibold text-gray-900 flex items-center gap-1">
        {name}
        <ShieldCheck className="w-4 h-4 text-blue-500" />
      </p>
      <p className="text-sm text-gray-500 mb-2">{profession}</p>
      <div className="flex items-center gap-1 mb-4">
        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
        <span className="text-sm font-medium text-gray-700">{rating}</span>
        <span className="text-sm text-gray-400">({jobsCompleted} jobs)</span>
      </div>
      <button className="w-full bg-blue-50 text-blue-700 py-2 rounded-xl text-sm font-medium hover:bg-blue-100 transition-colors">
        View Profile
      </button>
    </div>
  );
}
