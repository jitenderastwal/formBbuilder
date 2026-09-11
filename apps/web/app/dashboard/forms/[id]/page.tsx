"use client";

import { useParams } from "next/navigation";

export default function FormBuilderPage() {
  const params = useParams<{ id: string }>();

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-slate-100">
      <h1 className="text-2xl font-bold">Form Builder</h1>
      <p className="mt-2 text-slate-400">Editing form: {params.id}</p>
    </main>
  );
}