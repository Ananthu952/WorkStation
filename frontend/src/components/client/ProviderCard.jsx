import { Link } from "react-router-dom";
import { Star, ShieldCheck, MapPin, Briefcase } from "lucide-react";

export default function ProviderCard({ provider }) {
  const name = provider.business_name || "Service Provider";
  const profession = provider.category_name || "Service Provider";
  const location = [provider.city, provider.state].filter(Boolean).join(", ");
  const initials = name
    .split(/\s+/)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex flex-col items-center rounded-2xl border border-gray-100 bg-white p-5 text-center shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-lg font-semibold text-white">
        {initials}
      </div>

      <p className="flex items-center gap-1 font-semibold text-gray-900">
        {name}
        {provider.verified && (
          <ShieldCheck
            className="h-4 w-4 text-blue-500"
            aria-label="Verified provider"
          />
        )}
      </p>

      <p className="mb-2 text-sm text-gray-500">{profession}</p>

      {location && (
        <p className="mb-3 flex items-center gap-1 text-sm text-gray-500">
          <MapPin className="h-4 w-4 shrink-0" />
          {location}
        </p>
      )}

      <div className="mb-4 flex flex-wrap items-center justify-center gap-3 text-sm text-gray-600">
        {provider.rating != null && (
          <span className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            {Number(provider.rating).toFixed(1)}
          </span>
        )}

        {provider.experience != null && (
          <span className="flex items-center gap-1">
            <Briefcase className="h-3.5 w-3.5" />
            {provider.experience} years' experience
          </span>
        )}
      </div>

      {provider.hourly_rate != null && (
        <p className="mb-4 font-semibold text-gray-900">
          ₹{provider.hourly_rate}
          <span className="text-sm font-normal text-gray-500"> / hour</span>
        </p>
      )}

      <Link
  to={`/marketplace/${provider.id}`}
  className="mt-auto block w-full rounded-xl bg-blue-50 py-2 text-center text-sm font-medium text-blue-700 transition-colors hover:bg-blue-100"
>
  View Profile
</Link>
    </div>
  );
}
