import { formatDistanceToNow, format } from "date-fns";

export const relTime = (iso: string) => formatDistanceToNow(new Date(iso), { addSuffix: true });
export const fmtDate = (iso: string, fmt = "dd MMM yyyy") => format(new Date(iso), fmt);
export const fmtNum = (n: number) => n.toLocaleString();