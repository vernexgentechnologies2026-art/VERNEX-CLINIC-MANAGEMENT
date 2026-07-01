import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button, Card, Input, Select } from "../../../components/ui";
import { getPatientPortalProfile, updatePatientProfile } from "../../../services/patientPortal.service";
import { PatientProfileCard } from "../components/PatientProfileCard";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(8, "Phone is required"),
  age: z.coerce.number().min(1).max(120),
  gender: z.enum(["female", "male", "other"])
});

type ProfileForm = z.infer<typeof schema>;

export default function PatientProfile() {
  const profile = getPatientPortalProfile();
  const { register, handleSubmit, formState: { errors } } = useForm<ProfileForm>({ resolver: zodResolver(schema), defaultValues: { name: profile.name, phone: profile.phone, age: profile.age, gender: profile.gender } });
  const save = (data: ProfileForm) => updatePatientProfile(data);
  return <div className="mx-auto max-w-4xl space-y-5 pb-20"><div><h1 className="text-2xl font-bold">Patient Profile</h1><p className="text-sm text-slate-500">Basic details, emergency contact, allergies, and medical notes.</p></div><PatientProfileCard profile={profile} /><Card className="p-4"><h2 className="font-bold">Edit Profile Placeholder</h2><form onSubmit={handleSubmit(save)} className="mt-4 grid gap-4 sm:grid-cols-2"><label className="block"><span className="mb-2 block text-sm font-semibold">Name</span><Input {...register("name")} />{errors.name && <p className="mt-1 text-xs text-rose-600">{errors.name.message}</p>}</label><label className="block"><span className="mb-2 block text-sm font-semibold">Phone</span><Input {...register("phone")} />{errors.phone && <p className="mt-1 text-xs text-rose-600">{errors.phone.message}</p>}</label><label className="block"><span className="mb-2 block text-sm font-semibold">Age</span><Input type="number" {...register("age")} />{errors.age && <p className="mt-1 text-xs text-rose-600">Enter a valid age.</p>}</label><label className="block"><span className="mb-2 block text-sm font-semibold">Gender</span><Select {...register("gender")}><option value="female">Female</option><option value="male">Male</option><option value="other">Other</option></Select>{errors.gender && <p className="mt-1 text-xs text-rose-600">{errors.gender.message}</p>}</label><div className="flex gap-2 sm:col-span-2"><Button type="submit">Save changes</Button><Button type="button" variant="secondary">Edit profile</Button></div></form></Card></div>;
}
