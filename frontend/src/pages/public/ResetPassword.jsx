import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Lock, Eye, EyeOff, Loader2 } from "lucide-react";

import AuthLayout from "../../components/common/AuthLayout";
import { resetPassword } from "../../services/auth";

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";
  const resetToken = location.state?.resetToken || "";

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (!resetToken) {
      navigate("/forgot-password", { replace: true });
    }
  }, [resetToken, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const passwordsMatch = formData.password === formData.confirmPassword;

  const getPasswordStrength = () => {
    if (formData.password.length < 6) return { text: "Weak", color: "text-red-500" };
    if (formData.password.length < 10) return { text: "Medium", color: "text-yellow-500" };
    return { text: "Strong", color: "text-green-600" };
  };

  const passwordStrength = getPasswordStrength();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!passwordsMatch) return;

    try {
      setLoading(true);
      await resetPassword(resetToken, formData.password);
      navigate("/login", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't reset your password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create a new password"
      subtitle="Choose a strong password to secure your FixHive account."
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email */}
        <div className="rounded-xl bg-blue-50 border border-blue-100 p-4">
          <p className="text-sm text-slate-500">Resetting password for</p>
          <p className="font-semibold text-blue-700 mt-1 break-all">{email}</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        {/* New Password */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">New Password</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full pl-11 pr-11 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4 text-slate-400" />
              ) : (
                <Eye className="w-4 h-4 text-slate-400" />
              )}
            </button>
          </div>
          <p className="mt-2 text-sm text-slate-500">
            Password Strength:
            <span className={`ml-1 font-semibold ${passwordStrength.color}`}>
              {passwordStrength.text}
            </span>
          </p>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full pl-11 pr-11 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2"
            >
              {showConfirmPassword ? (
                <EyeOff className="w-4 h-4 text-slate-400" />
              ) : (
                <Eye className="w-4 h-4 text-slate-400" />
              )}
            </button>
          </div>
          {formData.confirmPassword && (
            <p
              className={`mt-2 text-sm font-medium ${
                passwordsMatch ? "text-green-600" : "text-red-500"
              }`}
            >
              {passwordsMatch ? "✓ Passwords match" : "✕ Passwords do not match"}
            </p>
          )}
        </div>

        {/* Security Note */}
        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
          <h3 className="text-sm font-semibold text-slate-900 mb-1">Security Tip</h3>
          <p className="text-sm text-slate-600 leading-6">
            Use at least 8 characters with uppercase, lowercase, numbers, and special characters
            for better security.
          </p>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || !passwordsMatch || formData.password.length < 6}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold transition"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Updating Password...
            </>
          ) : (
            "Reset Password"
          )}
        </button>
      </form>
    </AuthLayout>
  );
}
