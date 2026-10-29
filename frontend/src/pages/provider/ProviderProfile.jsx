import { useState, useEffect } from "react";
import {
  Star,
  Briefcase,
  CheckCircle2,
  DollarSign,
  ShieldCheck,
  Phone,
  MapPin,
  Loader2,
} from "lucide-react";
import { fetchMyProviderProfile, updateProviderProfile } from "../../services/provider";
import { fetchCategories } from "../../services/category";
import { useToast } from "../../context/ToastContext";

export default function ProviderProfile() {
  const { showToast } = useToast();

  const [providerId, setProviderId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    businessName: "",
    bio: "",
    experience: "",
    hourlyRate: "",
    phone: "",
    city: "",
    state: "",
    categoryId: "",
  });
  const [rating, setRating] = useState(null);
  const [verified, setVerified] = useState(false);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLoading(true);
    setLoadError("");

    Promise.all([fetchMyProviderProfile(), fetchCategories()])
      .then(([profileData, categoriesData]) => {
        setCategories(categoriesData.categories || []);

        if (profileData.success && profileData.provider) {
          const p = profileData.provider;
          setProviderId(p.id);
          setFormData({
            businessName: p.business_name || "",
            bio: p.bio || "",
            experience: p.experience ?? "",
            hourlyRate: p.hourly_rate ?? "",
            phone: p.phone || "",
            city: p.city || "",
            state: p.state || "",
            categoryId: p.category_id || "",
          });
          setRating(p.rating);
          setVerified(p.verified);
        } else {
          setLoadError("No provider profile found for this account yet.");
        }
      })
      .catch(() => setLoadError("Couldn't load your provider profile."))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!providerId) return;

    try {
      setSaving(true);
      await updateProviderProfile(providerId, {
        business_name: formData.businessName,
        bio: formData.bio,
        experience: Number(formData.experience),
        hourly_rate: Number(formData.hourlyRate),
        phone: formData.phone,
        city: formData.city,
        state: formData.state,
        category_id: Number(formData.categoryId),
      });
      showToast("Profile updated", "success");
    } catch (err) {
      showToast(err.response?.data?.message || "Couldn't save your changes.", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="max-w-[680px] mx-auto text-center py-24">
        <p className="text-gray-500">{loadError}</p>
      </div>
    );
  }

  return (
    <div className="max-w-[680px] mx-auto flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Provider Profile</h1>
        <p className="text-gray-500 mt-1">
          This information is shown to clients when they view your bids.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center">
          <Star className="w-5 h-5 text-blue-600 mx-auto mb-2" />
          <p className="text-xl font-bold text-gray-900">{rating ?? "—"}</p>
          <p className="text-xs text-gray-500 mt-0.5">Rating</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center">
          <ShieldCheck className={`w-5 h-5 mx-auto mb-2 ${verified ? "text-green-600" : "text-gray-300"}`} />
          <p className="text-xl font-bold text-gray-900">{verified ? "Verified" : "Unverified"}</p>
          <p className="text-xs text-gray-500 mt-0.5">Status</p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-5"
      >
        <h2 className="font-bold text-gray-900">Professional Information</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
          <div className="relative">
            <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              name="businessName"
              required
              value={formData.businessName}
              onChange={handleChange}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
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
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Experience (years)
            </label>
            <input
              type="number"
              name="experience"
              required
              min="0"
              value={formData.experience}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
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
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="tel"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                name="city"
                required
                value={formData.city}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
            <input
              type="text"
              name="state"
              required
              value={formData.state}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
          <textarea
            name="bio"
            rows={4}
            value={formData.bio}
            onChange={handleChange}
            placeholder="Tell clients about your experience and what makes your work stand out."
            className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:bg-gray-300 transition-all"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </button>
      </form>
    </div>
  );
}