import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, ArrowLeft, Loader2 } from "lucide-react";

import AuthLayout from "../../components/common/AuthLayout";
import { forgotPassword } from "../../services/auth";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isValidEmail = (value) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isValidEmail(email)) return;

    try {
      setLoading(true);
      await forgotPassword(email);
      navigate("/verify-otp", { state: { email } });
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't send the code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Forgot your password?"
      subtitle="Enter your email address and we'll send you a verification code."
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="email"
              required
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition"
            />
          </div>
          {email && !isValidEmail(email) && (
            <p className="mt-2 text-sm text-red-500">Please enter a valid email address.</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || !isValidEmail(email)}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold transition"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Sending...
            </>
          ) : (
            "Send Verification Code"
          )}
        </button>

        {/* Security Note */}
        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
          <h3 className="text-sm font-semibold text-slate-900 mb-1">Security Notice</h3>
          <p className="text-sm text-slate-600 leading-6">
            We&apos;ll send a 6-digit verification code to your registered email address. The
            code expires in <strong>5 minutes</strong>.
          </p>
        </div>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-4 my-8">
        <div className="flex-1 h-px bg-slate-200" />
        <span className="text-xs uppercase tracking-wider text-slate-400">
          Remembered your password?
        </span>
        <div className="flex-1 h-px bg-slate-200" />
      </div>

      {/* Back to Login */}
      <Link
        to="/login"
        className="flex items-center justify-center gap-2 border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition rounded-xl py-3 font-medium text-slate-700"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Login
      </Link>
    </AuthLayout>
  );
}
