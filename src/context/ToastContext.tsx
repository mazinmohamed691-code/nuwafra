import { createContext, useContext, useState, ReactNode, useCallback } from "react";
type Toast = { id: number; msg: string; type: "success" | "error" | "info" };
interface ToastCtx { push: (msg: string, type?: Toast["type"]) => void; }
const Ctx = createContext<ToastCtx>({ push: () => {} });
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const push = useCallback((msg: string, type: Toast["type"] = "info") => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  }, []);
  return (
    <Ctx.Provider value={{ push }}>
      {children}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2">
        {toasts.map(t => (
          <div key={t.id} className={`animate-fade px-5 py-3 rounded-xl shadow-lg text-white text-sm font-semibold ${t.type === "success" ? "bg-green-600" : t.type === "error" ? "bg-red-600" : "bg-gray-800"}`}>
            {t.msg}
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}
export const useToast = () => useContext(Ctx);