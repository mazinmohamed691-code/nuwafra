import { ReactNode } from "react";
export default function StatCard({ title, value, icon, hint, color = "brand" }: { title: string; value: ReactNode; icon?: ReactNode; hint?: string; color?: "brand" | "gold" | "ink" | "red"; }) {
  const map = { brand: "bg-green-50 text-green-700", gold: "bg-yellow-100 text-yellow-700", ink: "bg-gray-100 text-gray-800", red: "bg-red-50 text-red-600" };
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-gray-500 font-semibold">{title}</p>
          <p className="text-2xl font-extrabold text-gray-900 mt-2">{value}</p>
          {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
        </div>
        {icon && <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${map[color]}`}>{icon}</div>}
      </div>
    </div>
  );
}