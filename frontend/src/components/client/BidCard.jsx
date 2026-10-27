import { Star } from "lucide-react";
import StatusChip from "../ui/StatusChip";

export default function BidCard({ providerName, jobTitle, amount, rating, status }) {
  const initials = providerName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
      <div className="w-11 h-11 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold shrink-0">
        {initials}
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 truncate">{providerName}</p>
        <p className="text-sm text-gray-500 truncate">on {jobTitle}</p>
        <div className="flex items-center gap-1 mt-1">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span className="text-xs text-gray-500">{rating}</span>
        </div>
      </div>

      <div className="text-right shrink-0">
        <p className="font-bold text-gray-900 mb-1.5">${amount}</p>
        <StatusChip status={status} />
      </div>
    </div>
  );
}