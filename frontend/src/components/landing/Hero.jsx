import { Search, Star, ShieldCheck, Clock } from "lucide-react";

const TRUST_STATS = [
  { icon: Star, label: "4.9/5 average rating" },
  { icon: ShieldCheck, label: "Background-checked pros" },
  { icon: Clock, label: "Same-day availability" },
];

export default function Hero() {
  return (
    <section className="pt-40 pb-24 px-6 bg-gradient-to-b from-blue-50/60 to-white">
      <div className="max-w-[900px] mx-auto text-center">
        <span className="inline-flex items-center gap-2 bg-white border border-gray-200 shadow-sm px-4 py-1.5 rounded-full text-sm font-medium text-gray-700 mb-6">
          Trusted by 50,000+ homeowners
        </span>

        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 leading-tight mb-6">
          Find a handyman you can <span className="text-blue-600">trust</span>
        </h1>

        <p className="text-lg text-gray-600 max-w-[600px] mx-auto mb-10">
          Post your job, compare bids from verified local pros, and get it done —
          all in one place.
        </p>

        <div className="max-w-[560px] mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 p-2 flex flex-col sm:flex-row gap-2 mb-10">
          <div className="flex items-center flex-1 px-4 gap-3">
            <Search className="w-5 h-5 text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="What do you need help with?"
              className="w-full py-3 outline-none text-gray-700 placeholder:text-gray-400"
            />
          </div>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-all hover:scale-[1.02] active:scale-[0.98]">
            Find Pros
          </button>
        </div>

        <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
          {TRUST_STATS.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 text-gray-500 text-sm font-medium">
              <Icon className="w-4 h-4 text-blue-600" />
              {label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
