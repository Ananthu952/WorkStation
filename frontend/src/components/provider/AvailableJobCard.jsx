import { Calendar, DollarSign } from "lucide-react";

export default function AvailableJobCard({ title, categoryName, budget, deadline }) {
  const formattedDeadline = deadline
    ? new Date(deadline).toLocaleDateString(undefined, { month: "short", day: "numeric" })
    : null;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          {categoryName && (
            <p className="text-xs font-medium text-blue-600 mb-1">{categoryName}</p>
          )}
          <h3 className="font-semibold text-gray-900">{title}</h3>
        </div>
        <p className="font-bold text-gray-900 shrink-0">${budget}</p>
      </div>

      {formattedDeadline && (
        <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-4">
          <Calendar className="w-4 h-4" />
          Due {formattedDeadline}
        </div>
      )}

      <button className="w-full bg-blue-50 text-blue-700 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-100 transition-colors">
        View &amp; Submit Bid
      </button>
    </div>
  );
}