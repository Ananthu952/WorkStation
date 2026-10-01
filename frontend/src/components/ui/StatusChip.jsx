// Work statuses: open, assigned, completed (confirmed against the backend)
// Bid/application statuses: pending, accepted, rejected
// User account status: active, suspended
const STATUS_STYLES = {
  open: "bg-blue-50 text-blue-600",
  assigned: "bg-amber-50 text-amber-600",
  completed: "bg-green-50 text-green-600",
  cancelled: "bg-gray-100 text-gray-500",
  pending: "bg-amber-50 text-amber-600",
  accepted: "bg-green-50 text-green-600",
  rejected: "bg-red-50 text-red-500",
  active: "bg-green-50 text-green-600",
  suspended: "bg-red-50 text-red-500",
};

const STATUS_LABELS = {
  open: "Open",
  assigned: "Assigned",
  completed: "Completed",
  cancelled: "Cancelled",
  pending: "Pending",
  accepted: "Accepted",
  rejected: "Rejected",
  active: "Active",
  suspended: "Suspended",
};

export default function StatusChip({ status }) {
  const style = STATUS_STYLES[status] || "bg-gray-100 text-gray-500";
  const label = STATUS_LABELS[status] || status;

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${style}`}>
      {label}
    </span>
  );
}
