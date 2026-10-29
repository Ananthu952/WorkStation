import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  Award,
  Phone,
  MapPin,
  IdCard,
  Wrench,
  Calendar,
  DollarSign,
  Loader2,
  ShieldCheck,
  Clock,
  XCircle,
} from "lucide-react";

import { submitApplication, fetchMyApplication } from "../../services/providerApplication";
import { fetchCategories } from "../../services/category";

const AVAILABILITY_OPTIONS = [
  { value: "weekdays", label: "Weekdays only" },
  { value: "weekends", label: "Weekends only" },
  { value: "flexible", label: "Flexible / anytime" },
];

export default function BecomeProvider() {
  const navigate = useNavigate();

  const [checkingStatus, setCheckingStatus] = useState(true);
  const [existingApplication, setExistingApplication] = useState(null);

  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const [formData, setFormData] = useState({
    businessName: "",
    categoryId: "",
    experienceYears: "",
    phone: "",
    address: "",
    governmentId: "",
    licenseNumber: "",
    skills: "",
    availability: "flexible",
    hourlyRate: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchMyApplication()
      .then((data) => setExistingApplication(data.application))
      .catch(() => setExistingApplication(null))
      .finally(() => setCheckingStatus(false));

    fetchCategories()
      .then((data) => setCategories(data.categories || []))
      .catch(() => setError("Couldn't load categories. Please refresh and try again."))
      .finally(() => setCategoriesLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      await submitApplication({
        business_name: formData.businessName,
        category_id: Number(formData.categoryId),
        experience: Number(formData.experienceYears),
        phone: formData.phone,
        address: formData.address,
        government_id: formData.governmentId,
        license_number: formData.licenseNumber || undefined,
        skills: formData.skills,
        availability: formData.availability,
        hourly_rate: Number(formData.hourlyRate),
      });
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't submit your application. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (checkingStatus) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
      </div>
    );
  }

  // Already applied — show status instead of the form again
  if (existingApplication && !submitted) {
    if (existingApplication.status === "pending") {
      return (
        <div className="max-w-[560px] mx-auto text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center mx-auto mb-6">
            <Clock className="w-8 h-8 text-amber-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Application under review</h1>
          <p className="text-gray-500 mb-8">
            Your provider application is being reviewed by our team. You&apos;ll get access to
            the Provider Dashboard as soon as it&apos;s approved.
          </p>
          <button
            onClick={() => navigate("/client/dashboard")}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-all"
          >
            Back to Dashboard
          </button>
        </div>
      );
    }

    if (existingApplication.status === "rejected") {
      return (
        <div className="max-w-[560px] mx-auto text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Application not approved</h1>
          <p className="text-gray-500 mb-8">
            Your previous provider application wasn&apos;t approved. Contact support if you think
            this was a mistake.
          </p>
          <button
            onClick={() => navigate("/client/dashboard")}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-all"
          >
            Back to Dashboard
          </button>
        </div>
      );
    }

    // status === "approved"
    return (
      <div className="max-w-[560px] mx-auto text-center py-16">
        <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center mx-auto mb-6">
          <ShieldCheck className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">You&apos;re already a provider!</h1>
        <p className="text-gray-500 mb-8">Head over to your Provider Dashboard to get started.</p>
        <button
          onClick={() => navigate("/provider/dashboard")}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-all"
        >
          Go to Provider Dashboard
        </button>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="max-w-[560px] mx-auto text-center py-16">
        <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center mx-auto mb-6">
          <ShieldCheck className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Application submitted</h1>
        <p className="text-gray-500 mb-8">
          Thanks for applying to become a provider on FixHive. Our team will review your
          application and verify your details. You&apos;ll be notified once it&apos;s approved —
          your account will then have access to the Provider Dashboard.
        </p>
        <button
          onClick={() => navigate("/client/dashboard")}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-all"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[720px] mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Become a Provider</h1>
        <p className="text-gray-500 mt-1">
          Tell us about your trade and experience. Our team reviews every application before your
          provider account is activated.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        {/* Business name */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
          <div className="relative">
            <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              name="businessName"
              required
              value={formData.businessName}
              onChange={handleChange}
              placeholder="e.g. Lee's Plumbing Co"
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>
        </div>

        {/* Category */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">Service Category</label>
          {categoriesLoading ? (
            <p className="text-sm text-gray-400">Loading categories...</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, categoryId: cat.id }))}
                  className={`py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${
                    formData.categoryId === cat.id
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-gray-200 text-gray-500 hover:border-gray-300"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Experience & rate */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Years of Experience
            </label>
            <div className="relative">
              <Award className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="number"
                name="experienceYears"
                required
                min="0"
                value={formData.experienceYears}
                onChange={handleChange}
                placeholder="5"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hourly Rate ($)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="number"
                name="hourlyRate"
                required
                min="0"
                value={formData.hourlyRate}
                onChange={handleChange}
                placeholder="45"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="(555) 123-4567"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                name="address"
                required
                value={formData.address}
                onChange={handleChange}
                placeholder="Street, City, State"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
          </div>
        </div>

        {/* Verification */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Government ID Number
            </label>
            <div className="relative">
              <IdCard className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                name="governmentId"
                required
                value={formData.governmentId}
                onChange={handleChange}
                placeholder="Driver's license or national ID number"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
            <p className="mt-1.5 text-xs text-gray-400">
              Used only for identity verification — never shown publicly.
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              License Number <span className="text-gray-400 font-normal">(if applicable)</span>
            </label>
            <div className="relative">
              <IdCard className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                name="licenseNumber"
                value={formData.licenseNumber}
                onChange={handleChange}
                placeholder="e.g. state plumbing/electrical license"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <span className="inline-flex items-center gap-1.5">
              <Wrench className="w-4 h-4" />
              Skills
            </span>
          </label>
          <input
            type="text"
            name="skills"
            required
            value={formData.skills}
            onChange={handleChange}
            placeholder="e.g. Pipe fitting, leak repair, water heater installation"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
          <p className="mt-1.5 text-xs text-gray-400">Separate each skill with a comma.</p>
        </div>

        {/* Availability */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              Availability
            </span>
          </label>
          <div className="flex flex-col gap-2">
            {AVAILABILITY_OPTIONS.map((option) => (
              <label
                key={option.value}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all ${
                  formData.availability === option.value
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="availability"
                  value={option.value}
                  checked={formData.availability === option.value}
                  onChange={handleChange}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || !formData.categoryId}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3.5 rounded-xl font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Submitting Application...
            </>
          ) : (
            "Submit Application"
          )}
        </button>
      </form>
    </div>
  );
}