import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  ShieldCheck,
  Star,
  Briefcase,
  Phone,
  IndianRupee,
  LoaderCircle,
} from "lucide-react";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).replace(/\/$/, "");

export default function ProviderProfile() {
  const { providerId } = useParams();
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadProfile() {
      setLoading(true);
      setError("");
      setProvider(null);

      try {
        const response = await fetch(
          `${API_URL}/v1/providers/${providerId}`,
          {
            headers: { Accept: "application/json" },
            signal: controller.signal,
          }
        );

        const result = await response.json();

        if (!response.ok || !result.success || !result.provider) {
          throw new Error(
            response.status === 404
              ? "This provider profile was not found."
              : result.message || "Unable to load provider profile."
          );
        }

        setProvider(result.provider);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Unable to load provider profile.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadProfile();

    return () => controller.abort();
  }, [providerId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center py-20 text-gray-500">
        <LoaderCircle className="mb-3 h-8 w-8 animate-spin text-blue-600" />
        Loading provider profile...
      </div>
    );
  }

  if (error || !provider) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center">
        <h1 className="mb-2 text-xl font-bold text-gray-900">
          Provider not found
        </h1>
        <p className="mb-5 text-gray-500">
          {error || "This provider profile is unavailable."}
        </p>
        <Link
          to="/marketplace"
          className="inline-block rounded-xl bg-blue-600 px-5 py-2.5 text-white"
        >
          Back to Marketplace
        </Link>
      </div>
    );
  }

  const name = provider.business_name || "Service Provider";
  const location = [provider.city, provider.state]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        to="/marketplace"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Marketplace
      </Link>

      <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-2xl font-bold text-white">
            {name
              .split(/\s+/)
              .map((word) => word[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900">{name}</h1>
              {provider.verified && (
                <ShieldCheck
                  className="h-5 w-5 text-blue-600"
                  aria-label="Verified provider"
                />
              )}
            </div>

            <p className="mt-1 text-gray-500">
              {provider.category_name || "Service Provider"}
            </p>

            {location && (
              <p className="mt-2 flex items-center gap-1 text-sm text-gray-500">
                <MapPin className="h-4 w-4" />
                {location}
              </p>
            )}
          </div>
        </div>

        <div className="my-7 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {provider.rating != null && (
            <div className="rounded-xl bg-gray-50 p-4">
              <Star className="mb-2 h-5 w-5 text-amber-500" />
              <p className="font-semibold text-gray-900">
                {Number(provider.rating).toFixed(1)}
              </p>
              <p className="text-sm text-gray-500">Rating</p>
            </div>
          )}

          {provider.experience != null && (
            <div className="rounded-xl bg-gray-50 p-4">
              <Briefcase className="mb-2 h-5 w-5 text-blue-600" />
              <p className="font-semibold text-gray-900">
                {provider.experience} years
              </p>
              <p className="text-sm text-gray-500">Experience</p>
            </div>
          )}

          {provider.hourly_rate != null && (
            <div className="rounded-xl bg-gray-50 p-4">
              <IndianRupee className="mb-2 h-5 w-5 text-blue-600" />
              <p className="font-semibold text-gray-900">
                {provider.hourly_rate}
              </p>
              <p className="text-sm text-gray-500">Hourly rate</p>
            </div>
          )}
        </div>

        <div className="border-t border-gray-100 pt-6">
          <h2 className="mb-3 text-lg font-semibold text-gray-900">
            About this provider
          </h2>
          <p className="whitespace-pre-line leading-7 text-gray-600">
            {provider.bio || "No provider description has been added yet."}
          </p>
        </div>

        {provider.phone && (
          <div className="mt-6 border-t border-gray-100 pt-6">
            <h2 className="mb-3 font-semibold text-gray-900">
              Contact information
            </h2>
            <p className="flex items-center gap-2 text-gray-600">
              <Phone className="h-4 w-4" />
              {provider.phone}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}