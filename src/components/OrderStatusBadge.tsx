import { ORDER_STATUS } from "../lib/constants";
import type { OrderStatus } from "../types";
export default function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const s = ORDER_STATUS[status];
  return <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${s?.color || "bg-gray-100 text-gray-700"}`}>{s?.label || status}</span>;
}