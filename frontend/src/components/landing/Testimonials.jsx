import { Star } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Sarah M.",
    role: "Homeowner, Austin TX",
    quote:
      "I posted a leaky faucet job in the morning and had it fixed by dinner. Booking pros here is genuinely effortless.",
  },
  {
    name: "David R.",
    role: "Homeowner, Denver CO",
    quote:
      "Comparing bids side by side saved me a ton of money on a full room repaint. Communication with the pro was smooth too.",
  },
  {
    name: "Priya K.",
    role: "Homeowner, Seattle WA",
    quote:
      "The verified reviews gave me real confidence before hiring an electrician I'd never met. Would use again.",
  },
];

function TestimonialCard({ name, role, quote }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 flex flex-col gap-5">
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
        ))}
      </div>
      <p className="text-gray-700 leading-relaxed">&ldquo;{quote}&rdquo;</p>
      <div>
        <p className="font-semibold text-gray-900">{name}</p>
        <p className="text-sm text-gray-500">{role}</p>
      </div>
    </div>
  );
}

export default function Testimonials() {
  return (
    <section id="testimonials" className="max-w-[1280px] mx-auto py-24 px-6">
      <div className="text-center mb-14">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Loved by Homeowners
        </h2>
        <p className="text-gray-600">Real feedback from people who got the job done.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TESTIMONIALS.map((testimonial) => (
          <TestimonialCard key={testimonial.name} {...testimonial} />
        ))}
      </div>
    </section>
  );
}
