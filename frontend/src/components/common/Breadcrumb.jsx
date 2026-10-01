import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

// Usage:
// <Breadcrumb items={[{ label: "My Works", to: "/client/my-works" }, { label: "Fix leaking faucet" }]} />
// The last item (no "to") renders as plain, non-clickable text — the current page.
export default function Breadcrumb({ items }) {
  return (
    <nav className="flex items-center gap-1.5 text-sm mb-4" aria-label="Breadcrumb">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div key={index} className="flex items-center gap-1.5">
            {item.to && !isLast ? (
              <Link to={item.to} className="text-gray-500 hover:text-blue-600 transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? "text-gray-900 font-medium" : "text-gray-500"}>
                {item.label}
              </span>
            )}
            {!isLast && <ChevronRight className="w-3.5 h-3.5 text-gray-300" />}
          </div>
        );
      })}
    </nav>
  );
}
