import { Link } from "react-router-dom";
import { APP_NAME } from "../lib/constants";
const SIZES = { sm: "h-10", md: "h-14", lg: "h-20", xl: "h-32" };
export default function Logo({ size = "md", withText = false, to = "/" }: { size?: keyof typeof SIZES; withText?: boolean; to?: string; }) {
  const img = (
    <img src="/assets/logo/logo.png" alt={APP_NAME} className={`${SIZES[size]} w-auto object-contain`}
      onError={(e) => {
        const el = e.target as HTMLImageElement;
        el.style.display = "none";
        const parent = el.parentElement;
        if (parent && !parent.querySelector(".logo-fallback")) {
          const s = document.createElement("span");
          s.className = "logo-fallback text-green-700 font-extrabold text-2xl";
          s.textContent = "نوفرها";
          parent.appendChild(s);
        }
      }} />
  );
  const content = <div className="flex items-center gap-3">{img}{withText && <span className="hidden md:block font-extrabold text-green-700 text-xl">{APP_NAME}</span>}</div>;
  return to ? <Link to={to} className="inline-flex items-center">{content}</Link> : content;
}