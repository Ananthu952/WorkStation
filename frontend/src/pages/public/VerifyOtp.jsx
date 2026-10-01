import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Loader2, ArrowLeft, RotateCcw } from "lucide-react";

import AuthLayout from "../../components/common/AuthLayout";
import { verifyOtp as verifyOtpRequest, resendOtp } from "../../services/auth";

export default function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [seconds, setSeconds] = useState(120);

  const inputRefs = useRef([]);

  useEffect(() => {
    if (!email) {
      navigate("/forgot-password", { replace: true });
    }
  }, [email, navigate]);

  useEffect(() => {
    if (seconds <= 0) return;

    const timer = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds]);

  const formatTime = () => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  const handleVerify = async (code) => {
    setError("");
    try {
      setLoading(true);
      const data = await verifyOtpRequest(email, code);
      navigate("/reset-password", { state: { email, resetToken: data.resetToken } });
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired code.");
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    const code = updatedOtp.join("");
    if (code.length === 6 && !updatedOtp.includes("")) {
      handleVerify(code);
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();

    const paste = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (paste.length !== 6) return;

    const digits = paste.split("");
    setOtp(digits);
    handleVerify(paste);
  };

  const handleResend = async () => {
    setError("");
    try {
      await resendOtp(email);
      setSeconds(120);
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't resend the code.");
    }
  };

  return (
    <AuthLayout
      title="Verify your email"
      subtitle="Enter the 6-digit verification code sent to your email."
    >
      <div className="space-y-8">
        <div className="rounded-xl bg-blue-50 border border-blue-100 p-4">
          <p className="text-sm text-slate-600">Verification code sent to</p>
          <p className="font-semibold text-blue-700 mt-1 break-all">{email}</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        {/* OTP Inputs */}
        <div className="flex justify-between gap-3">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={handlePaste}
              disabled={loading}
              className="w-14 h-16 rounded-2xl border border-slate-200 text-center text-2xl font-bold text-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition disabled:bg-slate-100"
            />
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center gap-3 rounded-xl border border-blue-100 bg-blue-50 py-4">
            <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
            <span className="text-sm font-medium text-blue-700">Verifying code...</span>
          </div>
        )}

        {/* Timer */}
        {!loading && (
          <div className="text-center">
            {seconds > 0 ? (
              <>
                <p className="text-sm text-slate-500">Code expires in</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">{formatTime()}</p>
              </>
            ) : (
              <>
                <p className="text-sm text-red-500 mb-4">Verification code expired.</p>
                <button
                  type="button"
                  onClick={handleResend}
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
                >
                  <RotateCcw className="w-4 h-4" />
                  Resend Code
                </button>
              </>
            )}
          </div>
        )}

        {/* Divider */}
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-slate-200" />
          <span className="text-xs uppercase tracking-wider text-slate-400">Wrong email?</span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        {/* Back */}
        <Link
          to="/forgot-password"
          className="flex items-center justify-center gap-2 border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition rounded-xl py-3 font-medium text-slate-700"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
      </div>
    </AuthLayout>
  );
}
