import { ClipboardList, Users, CheckCircle2 } from "lucide-react";

const STEPS = [
  {
    icon: ClipboardList,
    title: "Post Your Job",
    description: "Describe what you need done and set your budget in under 2 minutes.",
  },
  {
    icon: Users,
    title: "Compare Bids",
    description: "Verified local pros send bids. Compare ratings, price, and reviews.",
  },
  {
    icon: CheckCircle2,
    title: "Get It Done",
    description: "Hire your favorite pro and track the job to completion, all in one place.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-gray-50 py-24 px-6">
      <div className="max-w-[1280px] mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-14">
          How FixHive Works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {STEPS.map((step, index) => (
            <div key={step.title} className="flex flex-col items-center">
              <div className="relative w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6">
                <step.icon className="w-7 h-7 text-blue-600" />
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                  {index + 1}
                </span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-gray-600 text-sm max-w-[260px]">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}