import { CURRENCY } from "./constants";
export const formatCurrency = (n: number | null | undefined) => `${Number(n || 0).toLocaleString("en-US", { maximumFractionDigits: 0 })} ${CURRENCY}`;
export const formatDate = (d: string | Date) => new Date(d).toLocaleDateString("ar-EG", { year: "numeric", month: "short", day: "numeric" });
export const formatDateTime = (d: string | Date) => new Date(d).toLocaleString("ar-EG", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
export const genOrderNumber = () => "NF-" + Date.now().toString().slice(-8);