import { Link } from "react-router-dom";
import {
  Search,
  Briefcase,
  Clock,
  CheckCircle2,
  DollarSign,
  Plus,
  Compass,
  FolderOpen,
  Bell,
  FileText,
  MessageSquare,
  UserCheck,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import StatCard from "../../components/client/StatCard";
import WorkCard from "../../components/client/WorkCard";
import BidCard from "../../components/client/BidCard";
import ProviderCard from "../../components/client/ProviderCard";

// Mock data — replace with real API calls (services/work.js, services/bid.js) once available
const STATS = [
  { icon: Briefcase, label: "Active Works", value: "3", accent: "blue" },
  { icon: Clock, label: "Pending Bids", value: "8", accent: "amber" },
  { icon: CheckCircle2, label: "Completed Jobs", value: "12", accent: "green" },
  { icon: DollarSign, label: "Total Spent", value: "$2,340", accent: "purple" },
];

const QUICK_ACTIONS = [
  { icon: Plus, label: "Post a Job", to: "/client/create-work" },
  { icon: Compass, label: "Browse Marketplace", to: "/marketplace" },
  { icon: FolderOpen, label: "My Works", to: "/client/my-works" },
  { icon: UserCheck, label: "Become a Provider", to: "/become-provider" },
];

const RECENT_WORKS = [
  {
    title: "Fix leaking kitchen faucet",
    categoryName: "Plumbing",
    budget: 120,
    deadline: "2026-08-10",
    status: "pending",
  },
  {
    title: "Repaint living room walls",
    categoryName: "Painting",
    budget: 480,
    deadline: "2026-08-15",
    status: "in_progress",
  },
  {
    title: "Install ceiling fan",
    categoryName: "Electrical",
    budget: 150,
    deadline: "2026-08-05",
    status: "completed",
  },
];

const RECENT_BIDS = [
  {
    providerName: "Marcus Lee",
    jobTitle: "Fix leaking kitchen faucet",
    amount: 120,
    rating: 4.9,
    status: "pending",
  },
  {
    providerName: "Sarah Chen",
    jobTitle: "Fix leaking kitchen faucet",
    amount: 95,
    rating: 4.8,
    status: "pending",
  },
  {
    providerName: "David Ortiz",
    jobTitle: "Repaint living room walls",
    amount: 340,
    rating: 4.7,
    status: "accepted",
  },
];

const RECOMMENDED_PROVIDERS = [
  { name: "Marcus Lee", profession: "Plumber", rating: 4.9, jobsCompleted: 210 },
  { name: "Priya Nair", profession: "Electrician", rating: 4.8, jobsCompleted: 175 },
  { name: "David Ortiz", profession: "Painter", rating: 4.7, jobsCompleted: 98 },
];

const ACTIVITY = [
  {
    icon: MessageSquare,
    text: "Marcus Lee sent a bid on “Fix leaking kitchen faucet”",
    time: "2 hours ago",
  },
  {
    icon: CheckCircle2,
    text: "You accepted David Ortiz's bid for “Repaint living room walls”",
    time: "1 day ago",
  },
  {
    icon: FileText,
    text: "You posted a new job: “Install ceiling fan”",
    time: "1 week ago",
  },
];

export default function ClientDashboard() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col gap-8">
      {/* Welcome + Search */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.firstName ?? "there"} 👋
          </h1>
          <p className="text-gray-500 mt-1">Here&apos;s what&apos;s happening with your jobs.</p>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search your jobs..."
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
          />
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {QUICK_ACTIONS.map(({ icon: Icon, label, to }) => (
          <Link
            key={label}
            to={to}
            className="bg-white border border-gray-100 shadow-sm rounded-2xl p-5 flex flex-col items-center gap-3 text-center hover:shadow-md hover:-translate-y-0.5 transition-all"
          >
            <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">
              <Icon className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-gray-700">{label}</span>
          </Link>
        ))}
      </div>

      {/* Main grid: works/bids left, notifications/timeline right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Recent Works</h2>
              <Link to="/client/my-works" className="text-sm text-blue-600 font-medium hover:underline">
                View all
              </Link>
            </div>
            <div className="flex flex-col gap-3">
              {RECENT_WORKS.map((work) => (
                <WorkCard key={work.title} {...work} />
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Recent Bids</h2>
              <Link to="/client/bids" className="text-sm text-blue-600 font-medium hover:underline">
                View all
              </Link>
            </div>
            <div className="flex flex-col gap-3">
              {RECENT_BIDS.map((bid, index) => (
                <BidCard key={`${bid.providerName}-${index}`} {...bid} />
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-4">Recommended Providers</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {RECOMMENDED_PROVIDERS.map((provider) => (
                <ProviderCard key={provider.name} {...provider} />
              ))}
            </div>
          </section>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-8">
          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="w-4 h-4 text-blue-600" />
              <h2 className="font-bold text-gray-900">Notifications</h2>
            </div>
            <div className="flex flex-col gap-4">
              {ACTIVITY.slice(0, 2).map((item, index) => (
                <div key={index} className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                    <item.icon className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-700 leading-snug">{item.text}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="font-bold text-gray-900 mb-4">Activity Timeline</h2>
            <div className="flex flex-col gap-5">
              {ACTIVITY.map((item, index) => (
                <div key={index} className="flex gap-3 relative">
                  {index !== ACTIVITY.length - 1 && (
                    <span className="absolute left-4 top-8 w-px h-full bg-gray-100" />
                  )}
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0 z-10">
                    <item.icon className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-700 leading-snug">{item.text}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
