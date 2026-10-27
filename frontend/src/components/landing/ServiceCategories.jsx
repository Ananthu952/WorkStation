import { Wrench, Zap, Hammer, PaintRoller, Sparkles, Settings } from "lucide-react";

const CATEGORIES = [
  { icon: Wrench, title: "Plumbing", jobs: "1,240 pros" },
  { icon: Zap, title: "Electrical", jobs: "980 pros" },
  { icon: Hammer, title: "Carpentry", jobs: "760 pros" },
  { icon: PaintRoller, title: "Painting", jobs: "1,050 pros" },
  { icon: Sparkles, title: "Cleaning", jobs: "1,430 pros" },
  { icon: Settings, title: "Appliance Repair", jobs: "610 pros" },
];

function CategoryCard({ icon: Icon, title, jobs }) {
  return (
    <button className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg p-6 flex flex-col items-start gap-4 text-left transition-all hover:-translate-y-1">
      <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
        <Icon className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
      </div>
      <div>
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500">{jobs}</p>
      </div>
    </button>
  );
}

export default function ServiceCategories() {
  return (
    <section id="categories" className="max-w-[1280px] mx-auto py-24 px-6">
      <div className="text-center mb-14">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Popular Categories
        </h2>
        <p className="text-gray-600">Browse trusted professionals by service type.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
        {CATEGORIES.map((category) => (
          <CategoryCard key={category.title} {...category} />
        ))}
      </div>
    </section>
  );
}