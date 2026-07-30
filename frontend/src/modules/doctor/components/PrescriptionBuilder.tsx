import { useState } from "react";
import { Plus, Send } from "lucide-react";
import { toast } from "sonner";
import { Button, Textarea } from "../../../components/ui";
import { getFavoriteMedicines, getLabTests, getPrescriptionTemplates } from "../../../services/doctor.service";
import { services } from "../../../services/serviceProvider";
import type { PatientProfile, PrescriptionItem, WhatsAppDeliveryStatus } from "../types";
import { LabTestSuggestionPanel } from "./LabTestSuggestionPanel";
import { MedicineReminderSetup } from "./MedicineReminderSetup";
import { MedicineRow } from "./MedicineRow";
import { PrescriptionPreview } from "./PrescriptionPreview";
import { PrescriptionTemplatePanel } from "./PrescriptionTemplatePanel";
import { PrescriptionWhatsAppModal } from "./PrescriptionWhatsAppModal";
import { ReminderConsentModal } from "./ReminderConsentModal";
import { ReminderSchedulePreview } from "./ReminderSchedulePreview";

const blank = (): PrescriptionItem => ({ id: crypto.randomUUID(), medicineName: "", dosage: "1 tablet", frequency: "1-0-1", timing: "After food", duration: "3 days", instructions: "", quantity: "" });
export function PrescriptionBuilder({ patient }: { patient: PatientProfile }) {
  const [items, setItems] = useState<PrescriptionItem[]>([{ ...blank(), medicineName: "Paracetamol 500mg" }]);
  const [sendOpen, setSendOpen] = useState(false);
  const [consentOpen, setConsentOpen] = useState(false);
  const [showReminders, setShowReminders] = useState(false);
  const [deliveryStatus, setDeliveryStatus] = useState<WhatsAppDeliveryStatus>("queued");
  const [savedPrescriptionId, setSavedPrescriptionId] = useState("");
  const [loading, setLoading] = useState(false);
  const [advice, setAdvice] = useState("");
  const [dietAdvice, setDietAdvice] = useState("");
  const [avoidItems, setAvoidItems] = useState("");
  const [restNote, setRestNote] = useState("");
  const update = (next: PrescriptionItem) => setItems((rows) => rows.map((row) => row.id === next.id ? next : row));
  const addItems = (newItems: PrescriptionItem[]) => setItems((rows) => [...rows, ...newItems.map((i) => ({ ...i, id: crypto.randomUUID() }))]);
  const savePrescription = async () => {
    if (!isUuid(patient.id)) {
      toast.error("Load a real patient record before saving a Supabase prescription.");
      return null;
    }
    const medicineRows = items.filter((item) => item.medicineName.trim());
    if (medicineRows.length === 0) {
      toast.error("Add at least one medicine before saving.");
      return null;
    }
    setLoading(true);
    try {
      const context = await services.auth.getCurrentAuthContext();
      const doctorProfile = await services.doctor.getDoctorProfileByStaffId(context.staffProfileId);
      if (!doctorProfile) throw new Error("No active doctor profile is linked to this staff user.");
      const [latestConsultation] = await services.doctor.getConsultationsByPatient(patient.id);
      const saved = await services.doctor.createPrescriptionWithItems({
        prescription: {
          clinic_id: context.clinic_id || doctorProfile.clinic_id,
          branch_id: context.branch_id || doctorProfile.branch_id,
          consultation_id: latestConsultation?.id || null,
          appointment_id: latestConsultation?.appointment_id || null,
          patient_id: patient.id,
          doctor_id: doctorProfile.id,
          diagnosis_summary: latestConsultation?.diagnosis || null,
          advice: formatAdvice(advice, dietAdvice, avoidItems, restNote),
          status: "draft",
          delivery_status: "queued",
          delivery_channel: "none",
          pharmacy_status: "not_sent",
          metadata: { source: "doctor_prescription_builder" },
        },
        items: medicineRows.map((item, index) => ({
          medicine_name: item.medicineName,
          dosage: item.dosage,
          frequency: item.frequency,
          timing: item.timing,
          duration: item.duration,
          food_instruction: item.timing.toLowerCase().includes("before") ? "before_food" : "after_food",
          quantity: item.quantity || null,
          instructions: item.instructions || null,
          sort_order: index,
          reminder_enabled: showReminders,
          reminder_frequency: showReminders ? item.frequency : null,
          reminder_start_date: showReminders ? new Date().toISOString().slice(0, 10) : null,
          metadata: { local_item_id: item.id },
        })),
        reminderConsentConfirmed: showReminders,
      });
      setSavedPrescriptionId(saved.prescription.id);
      toast.success("Prescription saved.");
      return saved.prescription.id;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save prescription.");
      return null;
    } finally {
      setLoading(false);
    }
  };
  const ensureSaved = async () => savedPrescriptionId || await savePrescription();
  const sendPrescription = async () => {
    const prescriptionId = await ensureSaved();
    if (!prescriptionId) return;
    setLoading(true);
    try {
      await services.doctor.sendPrescriptionToPatientPlaceholder(prescriptionId);
      setDeliveryStatus("sent");
      setSendOpen(false);
      toast.success("WhatsApp placeholder marked as sent.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update WhatsApp placeholder status.");
    } finally {
      setLoading(false);
    }
  };
  const routeToPharmacy = async () => {
    const prescriptionId = await ensureSaved();
    if (!prescriptionId) return;
    setLoading(true);
    try {
      await services.doctor.routePrescriptionToPharmacy(prescriptionId);
      toast.success("Prescription routed to pharmacy placeholder.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to route prescription to pharmacy.");
    } finally {
      setLoading(false);
    }
  };
  const finalizePrescription = async () => {
    const prescriptionId = await ensureSaved();
    if (!prescriptionId) return;
    setLoading(true);
    try {
      await services.doctor.updatePrescription(prescriptionId, { status: "finalized", finalized_at: new Date().toISOString() });
      toast.success("Prescription finalized.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to finalize prescription.");
    } finally {
      setLoading(false);
    }
  };
  return <div className="space-y-5"><div className="card p-5"><div className="flex flex-wrap items-center justify-between gap-2"><h2 className="font-bold">Medicine Builder</h2><div className="flex flex-wrap gap-2"><Button type="button" variant="secondary" icon={<Plus className="size-4" />} onClick={() => setItems([...items, blank()])}>Add Medicine</Button><Button type="button" variant="ghost" onClick={() => setItems([])}>Clear Prescription</Button></div></div><div className="mt-4 space-y-3">{items.map((item) => <MedicineRow key={item.id} item={item} onChange={update} onRemove={() => setItems(items.filter((row) => row.id !== item.id))} />)}</div></div><div className="grid gap-5 xl:grid-cols-[.7fr_1.3fr]"><div className="space-y-5"><div className="card p-5"><h2 className="font-bold">Favorite Medicines</h2><div className="mt-3 flex flex-wrap gap-2">{getFavoriteMedicines().map((m) => <Button key={m.id} variant="secondary" className="min-h-8 px-3 py-1" onClick={() => addItems([{ ...blank(), medicineName: m.name }])}>{m.name}</Button>)}</div></div><PrescriptionTemplatePanel templates={getPrescriptionTemplates()} onUse={addItems} /><LabTestSuggestionPanel tests={getLabTests()} />{showReminders && <ReminderSchedulePreview items={items} />}</div><div className="space-y-5"><div className="card p-5"><h2 className="font-bold">Advice</h2><div className="mt-3 grid gap-3 md:grid-cols-2"><Textarea placeholder="General advice" value={advice} onChange={(event) => setAdvice(event.target.value)} /><Textarea placeholder="Diet advice" value={dietAdvice} onChange={(event) => setDietAdvice(event.target.value)} /><Textarea placeholder="Avoid items" value={avoidItems} onChange={(event) => setAvoidItems(event.target.value)} /><Textarea placeholder="Rest/work note" value={restNote} onChange={(event) => setRestNote(event.target.value)} /></div></div>{showReminders && <div className="card p-5"><h2 className="font-bold">WhatsApp Medicine Reminders</h2><p className="mt-1 text-sm text-slate-500">Optional. Do not enable without consent.</p><div className="mt-4"><MedicineReminderSetup items={items} /></div></div>}<PrescriptionPreview patient={patient} items={items} /></div></div><div className="sticky bottom-3 z-10 flex flex-wrap gap-2 rounded-2xl border bg-white/95 p-3 shadow-card backdrop-blur"><Button loading={loading} onClick={() => void savePrescription()}>Save Prescription</Button><Button loading={loading} icon={<Send className="size-4" />} onClick={() => setSendOpen(true)}>Send Prescription to WhatsApp</Button><Button loading={loading} variant="secondary" onClick={() => void routeToPharmacy()}>Send to Pharmacy</Button><Button variant="secondary" onClick={() => { window.print(); toast.info("Print placeholder opened."); }}>Print</Button><Button variant="secondary" onClick={() => setConsentOpen(true)}>Enable Medicine Reminders</Button><Button loading={loading} onClick={() => void finalizePrescription()}>Complete Consultation</Button>{deliveryStatus !== "queued" && <span className="rounded-full bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700">WhatsApp status: {deliveryStatus}</span>}{savedPrescriptionId && <span className="rounded-full bg-slate-100 px-3 py-2 text-xs font-bold text-slate-600">Saved</span>}</div><PrescriptionWhatsAppModal open={sendOpen} patient={patient} items={items} status={deliveryStatus} onClose={() => setSendOpen(false)} onSend={() => void sendPrescription()} /><ReminderConsentModal open={consentOpen} onClose={() => setConsentOpen(false)} onEnable={() => { setShowReminders(true); setConsentOpen(false); }} /></div>;
}

function formatAdvice(general: string, diet: string, avoid: string, rest: string) {
  return [
    general && `Advice: ${general}`,
    diet && `Diet: ${diet}`,
    avoid && `Avoid: ${avoid}`,
    rest && `Rest/work: ${rest}`,
  ].filter(Boolean).join("\n");
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}
