import type { WhatsAppMessage } from "../types";

export function ChatBubble({ message }: { message: WhatsAppMessage }) {
  const isPatient = message.sender === "patient";
  const isReception = message.sender === "reception";
  return <div className={`flex ${isPatient ? "justify-end" : "justify-start"}`}><div className={`max-w-[88%] whitespace-pre-line rounded-lg px-4 py-3 text-sm leading-6 shadow-sm sm:max-w-[78%] ${isPatient ? "rounded-br-sm bg-brand-600 text-white" : isReception ? "rounded-bl-sm bg-amber-50 text-amber-950 ring-1 ring-amber-100" : "rounded-bl-sm bg-white text-slate-700 ring-1 ring-slate-100"}`}><p>{message.text}</p><p className={`mt-1 text-[10px] font-bold uppercase ${isPatient ? "text-brand-100" : "text-slate-400"}`}>{message.sender} - {message.time}</p></div></div>;
}
