import type { ReactNode } from "react";
import { X } from "lucide-react";
export function Modal({ open, title, onClose, children }: { open: boolean; title: string; onClose: () => void; children: ReactNode }) { if (!open) return null; return <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/30 p-4"><div className="card w-full max-w-lg p-6"><div className="mb-5 flex items-center justify-between"><h2 className="text-lg font-bold">{title}</h2><button onClick={onClose} aria-label="Close"><X /></button></div>{children}</div></div>; }
