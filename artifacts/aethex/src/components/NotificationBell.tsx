import { useState, useEffect, useRef } from "react";
import { Bell, Package, Sparkles, Tag, BookOpen, CheckCheck, X, ChevronRight } from "lucide-react";
import { useLocation } from "wouter";
import { useSession } from "@/hooks/use-session";

interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  link?: string;
  read: boolean;
  iconType: string;
  orderId?: string;
  createdAt: string;
}

function NotifIcon({ iconType, type }: { iconType: string; type: string }) {
  const cls = "w-4 h-4";
  if (iconType === "check" || type === "order_update") return <Package className={cls} />;
  if (iconType === "truck") return <Package className={cls} />;
  if (type === "pro_status") return <Sparkles className={cls} />;
  if (type === "offer") return <Tag className={cls} />;
  if (type === "study_material") return <BookOpen className={cls} />;
  return <Bell className={cls} />;
}

function timeAgo(ts: string): string {
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function iconBg(type: string): string {
  if (type === "order_update") return "rgba(34,211,238,0.15)";
  if (type === "pro_status") return "rgba(168,85,247,0.15)";
  if (type === "offer") return "rgba(251,191,36,0.15)";
  return "rgba(255,255,255,0.08)";
}
function iconColor(type: string): string {
  if (type === "order_update") return "#22D3EE";
  if (type === "pro_status") return "#A855F7";
  if (type === "offer") return "#FBBF24";
  return "#8B949E";
}

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const sessionId = useSession();
  const [, setLocation] = useLocation();

  const apiBase = import.meta.env.BASE_URL.replace(/\/$/, "");

  const fetchNotifications = async () => {
    if (!sessionId) return;
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/api/notifications?sessionId=${sessionId}`);
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications ?? []);
        setUnreadCount(data.unreadCount ?? 0);
      }
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [sessionId]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node) && !btnRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const markAllRead = async () => {
    if (!sessionId) return;
    await fetch(`${apiBase}/api/notifications/mark-read`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
    });
    setNotifications(n => n.map(x => ({ ...x, read: true })));
    setUnreadCount(0);
  };

  const markRead = async (id: number) => {
    if (!sessionId) return;
    await fetch(`${apiBase}/api/notifications/mark-read`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, notificationId: id }),
    });
    setNotifications(n => n.map(x => x.id === id ? { ...x, read: true } : x));
    setUnreadCount(c => Math.max(0, c - 1));
  };

  const handleNotifClick = (notif: Notification) => {
    if (!notif.read) markRead(notif.id);
    setOpen(false);
    if (notif.link) {
      if (notif.link.startsWith("/")) setLocation(notif.link);
      else window.open(notif.link, "_blank");
    }
  };

  const dismiss = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (!sessionId) return;
    await fetch(`${apiBase}/api/notifications/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
    });
    setNotifications(n => n.filter(x => x.id !== id));
    setUnreadCount(c => {
      const notif = notifications.find(x => x.id === id);
      return notif && !notif.read ? Math.max(0, c - 1) : c;
    });
  };

  return (
    <div className="relative">
      <button ref={btnRef} onClick={() => { setOpen(o => !o); if (!open) fetchNotifications(); }}
        className="relative w-9 h-9 rounded-full flex items-center justify-center transition-all hover:bg-gray-100"
        aria-label="Notifications">
        <Bell className="w-5 h-5 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-white text-[10px] font-bold flex items-center justify-center"
            style={{ background: "#22D3EE", color: "#0D1117" }}>
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div ref={panelRef} className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl shadow-2xl overflow-hidden z-[200]"
          style={{ background: "#161B22", border: "1px solid #21262D", top: "calc(100% + 8px)" }}>
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid #21262D" }}>
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4" style={{ color: "#22D3EE" }} />
              <span className="font-semibold text-sm" style={{ color: "#E6EDF3" }}>Notifications</span>
              {unreadCount > 0 && (
                <span className="text-xs px-1.5 py-0.5 rounded-full font-bold" style={{ background: "rgba(34,211,238,0.15)", color: "#22D3EE" }}>
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="flex items-center gap-1 text-xs transition-opacity hover:opacity-80" style={{ color: "#22D3EE" }}>
                <CheckCheck className="w-3.5 h-3.5" /> Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="overflow-y-auto" style={{ maxHeight: "360px" }}>
            {loading && notifications.length === 0 ? (
              <div className="py-8 text-center text-sm" style={{ color: "#8B949E" }}>Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="py-10 text-center">
                <Bell className="w-8 h-8 mx-auto mb-2" style={{ color: "#8B949E", opacity: 0.4 }} />
                <div className="text-sm font-medium" style={{ color: "#8B949E" }}>No notifications yet</div>
              </div>
            ) : notifications.map(n => (
              <div key={n.id} onClick={() => handleNotifClick(n)}
                className="flex items-start gap-3 px-4 py-3 cursor-pointer transition-all hover:bg-white/5 relative"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", background: !n.read ? "rgba(34,211,238,0.03)" : "transparent" }}>
                {/* Unread dot */}
                {!n.read && <div className="absolute left-1.5 top-4 w-1.5 h-1.5 rounded-full" style={{ background: "#22D3EE" }} />}
                {/* Icon */}
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-0.5"
                  style={{ background: iconBg(n.type) }}>
                  <span style={{ color: iconColor(n.type) }}><NotifIcon iconType={n.iconType} type={n.type} /></span>
                </div>
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium" style={{ color: "#E6EDF3" }}>{n.title}</div>
                  <div className="text-xs mt-0.5 leading-relaxed" style={{ color: "#8B949E" }}>{n.message}</div>
                  <div className="text-xs mt-1" style={{ color: "#8B949E", opacity: 0.7 }}>{timeAgo(n.createdAt)}</div>
                </div>
                {/* Actions */}
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <button onClick={e => dismiss(e, n.id)} className="p-0.5 rounded hover:bg-white/10 transition-all" title="Dismiss">
                    <X className="w-3.5 h-3.5" style={{ color: "#8B949E" }} />
                  </button>
                  {n.link && <ChevronRight className="w-3.5 h-3.5" style={{ color: "#8B949E", opacity: 0.5 }} />}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="px-4 py-2.5" style={{ borderTop: "1px solid #21262D" }}>
            <a href="/orders/track" onClick={() => setOpen(false)}
              className="text-xs transition-opacity hover:opacity-80 block text-center"
              style={{ color: "#22D3EE" }}>
              View all orders →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
