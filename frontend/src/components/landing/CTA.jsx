import { Link } from "react-router-dom";
export default function CTA() {
  return (
    <section className="px-6 py-24 max-w-[1280px] mx-auto">
      <div className="bg-blue-600 rounded-[32px] px-8 py-16 md:py-20 text-center text-white relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Ready to get your job done?
          </h2>

          <p className="text-blue-100 text-lg mb-10 max-w-[500px] mx-auto">
            Join thousands of homeowners finding trusted pros on FixHive today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold hover:bg-blue-50 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Post a Job
            </Link>

            <Link
              to="/register"
              className="bg-blue-500/40 border border-white/30 text-white px-8 py-4 rounded-full font-semibold hover:bg-blue-500/60 transition-all"
            >
              Become a Pro
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}