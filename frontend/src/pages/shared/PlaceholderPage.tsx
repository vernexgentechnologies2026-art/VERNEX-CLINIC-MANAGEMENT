import { Construction } from "lucide-react";
import { useLocation } from "react-router-dom";
import { PageHeader } from "../../components/common/PageHeader";
import { Card } from "../../components/common/Card";
export default function PlaceholderPage(){
 const location=useLocation(); const title=location.pathname.split("/").filter(Boolean).pop()?.replaceAll("-"," ").replace(/\b\w/g,(c: string)=>c.toUpperCase()) || "Workspace";
 return <><PageHeader title={title} description="This workflow is ready for backend data and business rules."/><Card className="flex min-h-72 flex-col items-center justify-center p-8 text-center"><div className="rounded-2xl bg-brand-50 p-4 text-brand-700"><Construction/></div><h2 className="mt-4 text-lg font-bold">{title} foundation</h2><p className="mt-2 max-w-md text-sm leading-6 text-slate-500">The route, navigation, layout, and visual system are in place. Connect this view to Supabase when the backend schema is ready.</p></Card></>;
}
