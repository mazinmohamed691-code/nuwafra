import { useEffect, useState } from "react";
import EmptyState from "../../components/EmptyState";
import { useAuth } from "../../context/AuthContext";
import { getNotifications, markNotificationsRead } from "../../lib/db";
import { formatDateTime } from "../../lib/format";
import type { Notification } from "../../types";
export default function Notifications() {
  const { user } = useAuth();
  const [items, setItems] = useState<Notification[]>([]);
  useEffect(() => { if (!user) return; getNotifications(user.id).then(setItems); }, [user]);
  const markAll = async () => { if (!user) return; await markNotificationsRead(user.id); setItems(items.map(n => ({ ...n, is_read: true }))); };
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold">الإشعارات</h1>
        <button onClick={markAll} className="text-green-700 text-sm font-semibold">تعليم الكل كمقروء</button>
      </div>
      {items.length === 0 ? <EmptyState icon="🔔" title="لا توجد إشعارات"/> : <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-100">{items.map(n => (<div key={n.id} className={`p-4 ${!n.is_read ? "bg-green-50/40" : ""}`}><div className="flex items-start gap-3"><div className="w-10 h-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center shrink-0">{n.type === "success" ? "✅" : n.type === "promo" ? "🎁" : "🔔"}</div><div className="flex-1"><p className="font-bold text-sm">{n.title}</p>{n.body && <p className="text-xs text-gray-600 mt-1">{n.body}</p>}<p className="text-xs text-gray-400 mt-1">{formatDateTime(n.created_at)}</p></div>{!n.is_read && <span className="w-2 h-2 rounded-full bg-green-600 mt-2"/>}</div></div>))}</div>}
    </div>
  );
}