import { Link } from "react-router-dom";
import { Wrench, ShieldCheck, Star, Clock, CheckCircle2 } from "lucide-react";

const HIGHLIGHTS = [
  { icon: ShieldCheck, text: "Background-checked professionals" },
  { icon: Star, text: "4.9/5 average rating from clients" },
  { icon: Clock, text: "Most jobs booked within 24 hours" },
];

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="h-screen flex overflow-hidden bg-white text-slate-900 antialiased selection:bg-blue-500 selection:text-white">
      {/* Left side: Brand Panel (Light Theme) */}
      <div className="hidden lg:flex lg:w-1/2 h-screen sticky top-0 flex-col p-12 lg:p-16 bg-white border-r border-slate-100 overflow-hidden">
        {/* Subtle Light Accent Orbs */}
        <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full bg-blue-50/80 blur-3xl" />
        <div className="pointer-events-none absolute bottom-10 right-0 w-80 h-80 rounded-full bg-indigo-50/60 blur-3xl" />

        {/* Subtle Micro Pattern overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #e2e8f0 1px, transparent 0)`,
            backgroundSize: "24px 24px",
          }}
        />

        {/* Brand Header */}
        <Link to="/" className="relative z-10 flex items-center gap-3 group w-fit">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform duration-200">
            <Wrench className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            Fix<span className="text-blue-600">Hive</span>
          </span>
        </Link>

        {/* Hero Content */}
        <div className="relative z-10 flex-1 flex flex-col justify-center max-w-lg">
<div className="self-start inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold mb-6">            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
            Top-Rated Home Service Network
          </div>

          <h2 className="text-4xl xl:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15] mb-6">
            Trusted pros, <br />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              done-right jobs.
            </span>
          </h2>

          {/* Highlights List */}
          <div className="flex flex-col gap-4 mb-10">
            {HIGHLIGHTS.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3.5 group">
                <div className="w-9 h-9 rounded-lg bg-blue-50/80 border border-blue-100 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:border-blue-600 transition-colors duration-200 group-hover:text-white">
                  <Icon className="w-4 h-4 text-blue-600 group-hover:text-white transition-colors" />
                </div>
                <span className="text-slate-600 text-sm font-medium">{text}</span>
              </div>
            ))}
          </div>

          {/* Stat Card */}
          <div className="bg-white/80 backdrop-blur-md border border-slate-200/80 rounded-2xl p-6 shadow-xl shadow-slate-100 flex items-center justify-between">
            <div>
              <p className="text-3xl font-extrabold text-slate-900">50k+</p>
              <p className="text-slate-500 text-xs font-medium mt-1">Jobs completed</p>
            </div>
            <div className="w-px h-10 bg-slate-100" />
            <div>
              <p className="text-3xl font-extrabold text-slate-900">6,500+</p>
              <p className="text-slate-500 text-xs font-medium mt-1">Verified pros</p>
            </div>
            <div className="w-px h-10 bg-slate-100" />
            <div>
              <p className="text-3xl font-extrabold text-amber-500">4.9★</p>
              <p className="text-slate-500 text-xs font-medium mt-1">Avg rating</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="relative z-10 text-slate-400 text-xs font-medium">
          © 2026 FixHive Inc. All rights reserved.
        </p>
      </div>

      {/* Right side: Form Panel */}
<div className="flex-1 h-screen overflow-y-auto p-6 sm:p-12 lg:p-16 bg-white">
          {/* Mobile Header Link */}
        <div className="lg:hidden flex items-center justify-center pt-4 pb-8">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-500/20">
              <Wrench className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">
              Fix<span className="text-blue-600">Hive</span>
            </span>
          </Link>
        </div>

        {/* Form Container */}
        <div className="w-full max-w-sm mx-auto pt-16">
          <div className="mb-8 text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-2">
              {title}
            </h1>
            <p className="text-slate-500 text-sm leading-relaxed">
              {subtitle}
            </p>
          </div>

          {/* Form Children Container */}
          <div>{children}</div>
        </div>

        {/* Footer for Mobile View */}
        <div className="mt-8 text-center lg:hidden">
          <p className="text-slate-400 text-xs">
            © 2026 FixHive Inc. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}