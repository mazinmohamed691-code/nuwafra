export default function AnimatedBackground({ grid = true, intensity = "normal", gold = true }: { grid?: boolean; intensity?: "light" | "normal" | "strong"; gold?: boolean; }) {
  const opacity = intensity === "light" ? "opacity-50" : intensity === "strong" ? "opacity-100" : "opacity-80";
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden -z-10 ${opacity}`}>
      <div className="absolute inset-0 bg-gradient-to-b from-green-50/70 via-white to-white" />
      {grid && <div className="absolute inset-0 animate-grid opacity-[0.35]" style={{ backgroundImage: "radial-gradient(circle, rgba(21,128,61,0.18) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />}
      <div className="absolute animate-blob rounded-full blur-3xl" style={{ width: "520px", height: "520px", top: "-120px", right: "-100px", background: "radial-gradient(circle at 30% 30%, rgba(34,197,94,0.35), rgba(34,197,94,0) 70%)" }} />
      <div className="absolute animate-blob-2 rounded-full blur-3xl" style={{ width: "420px", height: "420px", bottom: "-120px", left: "-100px", background: "radial-gradient(circle at 70% 30%, rgba(22,163,74,0.30), rgba(22,163,74,0) 70%)" }} />
      {gold && <div className="absolute animate-blob animate-shimmer rounded-full blur-3xl" style={{ width: "320px", height: "320px", top: "30%", left: "40%", background: "radial-gradient(circle at 50% 50%, rgba(234,179,8,0.22), rgba(234,179,8,0) 70%)" }} />}
    </div>
  );
}