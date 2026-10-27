export default function Tabs({ tabs, value, onChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
            value === tab.value
              ? "bg-blue-600 text-white"
              : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"
          }`}
        >
          {tab.label}
          {typeof tab.count === "number" && <span className="ml-1.5">({tab.count})</span>}
        </button>
      ))}
    </div>
  );
}