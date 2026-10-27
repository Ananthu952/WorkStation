import StatusChip from "../ui/StatusChip";

// clientName dropped — no user-lookup endpoint exists to populate it honestly
export default function ApplicationCard({ jobTitle, amount, status }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-start justify-between gap-4 mb-2">
        <h3 className="font-semibold text-gray-900">{jobTitle}</h3>
        <StatusChip status={status} />
      </div>
      <div className="flex items-center justify-end text-sm mt-3">
        <span className="font-bold text-gray-900">${amount}</span>
      </div>
    </div>
  );
}