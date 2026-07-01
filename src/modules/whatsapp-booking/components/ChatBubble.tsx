import type { WhatsAppMessage } from "../types";

export function ChatBubble({ message }: { message: WhatsAppMessage }) {
  const isPatient = message.sender === "patient";
  const isReception = message.sender === "reception";
  return <div className={`flex ${isPatient ? "justify-end" : "justify-start"}`}><div className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm shadow-sm ${isPatient ? "rounded-br-sm bg-emerald-100 text-emerald-950" : isReception ? "rounded-bl-sm bg-amber-100 text-amber-950" : "rounded-bl-sm bg-white text-slate-700"}`}><p>{message.text}</p><p className="mt-1 text-[10px] font-bold uppercase text-slate-400">{message.sender} · {message.time}</p></div></div>;
}
