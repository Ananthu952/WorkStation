import { useState } from "react";
import { MessageSquare, CheckCircle2, Star, FileText, Bell, Check } from "lucide-react";
import Tabs from "../components/common/Tabs";

// Mock data — replace with a real fetchNotifications() call once the endpoint exists
const INITIAL_NOTIFICATIONS = [
  {
    id: "1",
    icon: MessageSquare,
    text: "Marcus Lee sent a bid on “Fix leaking kitchen faucet”",
    time: "2 hours ago",
    read: false,
  },
  {
    id: "2",
    icon: CheckCircle2,
    text: "You accepted David Ortiz's bid for “Repaint living room walls”",
    time: "1 day ago",
    read: false,
  },
  {
    id: "3",
    icon: Star,
    text: "You received a 5-star review from Tom Becker",
    time: "3 days ago",
    read: true,
  },
  {
    id: "4",
    icon: FileText,
    text: "You posted a new job: “Install ceiling fan”",
    time: "1 week ago",
    read: true,
  },
];

export default function Notifications() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState("all");

  const filtered =
    activeTab === "all" ? notifications : notifications.filter((n) => !n.read);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="max-w-[680px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-500 mt-1">Stay on top of activity across your account.</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="inline-flex items-center gap-1.5 text-sm text-blue-600 font-medium hover:underline shrink-0"
          >
            <Check className="w-4 h-4" />
            Mark all as read
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <Tabs
          tabs={[
            { label: "All", value: "all" },
            { label: "Unread", value: "unread", count: unreadCount > 0 ? unreadCount : undefined },
          ]}
          value={activeTab}
          onChange={setActiveTab}
        />
      </div>

      {filtered.length > 0 ? (
        <div className="flex flex-col gap-3">
          {filtered.map((notification) => (
            <button
              key={notification.id}
              onClick={() => markAsRead(notification.id)}
              className={`w-full text-left flex items-start gap-4 p-4 rounded-2xl border transition-colors ${
                notification.read
                  ? "bg-white border-gray-100"
                  : "bg-blue-50/60 border-blue-100 hover:bg-blue-50"
              }`}
            >
              <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                <notification.icon className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700 leading-snug">{notification.text}</p>
                <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
              </div>
              {!notification.read && (
                <span className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 shrink-0" />
              )}
            </button>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
            <Bell className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">You&apos;re all caught up</h3>
          <p className="text-gray-500 text-sm max-w-[280px]">No unread notifications right now.</p>
        </div>
      )}
    </div>
  );
}