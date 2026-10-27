import { Calendar, DollarSign } from "lucide-react";
import StatusChip from "../ui/StatusChip";

// bidCount is optional — bid endpoints aren't confirmed against the backend yet,
// so this only renders if a caller actually has a real count to pass in.
export default function WorkCard({ title, categoryName, budget, deadline, status, bidCount }) {
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
        <StatusChip status={status} />
      </div>

      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
        <span className="flex items-center gap-1.5">
          <DollarSign className="w-4 h-4" />${budget}
        </span>
        {formattedDeadline && (
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            Due {formattedDeadline}
          </span>
        )}
        {typeof bidCount === "number" && (
          <span className="font-medium text-gray-700">{bidCount} bids</span>
        )}
      </div>
    </div>
  );
}