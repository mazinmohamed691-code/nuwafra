import { ReactNode } from "react";
export default function EmptyState({ icon = "📭", title, subtitle, action }: { icon?: string | ReactNode; title: string; subtitle?: string; action?: ReactNode; }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
      <div className="text-5xl mb-3">{icon}</div>
      <h3 className="font-bold text-lg text-gray-900">{title}</h3>
      {subtitle && <p className="text-sm text-gray-500 mt-2">{subtitle}</p>}
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  );
}