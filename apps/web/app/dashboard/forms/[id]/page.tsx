"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ArrowLeftIcon, PencilIcon, PlusIcon, Trash2Icon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCreateFormField, useDeleteFormField, useListFormFields, useUpdateFormField } from "~/hooks/api/form";

const fieldTypes = ["TEXT", "NUMBER", "EMAIL", "YES_NO", "PASSWORD"] as const;
type FieldType = (typeof fieldTypes)[number];
const fieldTypeLabels: Record<FieldType, string> = { TEXT: "Short text", NUMBER: "Number", EMAIL: "Email", YES_NO: "Yes / No", PASSWORD: "Password" };
type FieldDraft = { label: string; type: FieldType; description: string; placeholder: string; isRequired: boolean };
const initialDraft: FieldDraft = { label: "", type: "TEXT", description: "", placeholder: "", isRequired: false };

export default function FormBuilderPage() {
  const { id: formId } = useParams<{ id: string }>();
  const [draft, setDraft] = useState<FieldDraft>(initialDraft);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { fields, isLoading, isError } = useListFormFields(formId);
  const { createFormFieldAsync, isPending: isCreating } = useCreateFormField();
  const { updateFormFieldAsync, isPending: isUpdating } = useUpdateFormField();
  const { deleteFormFieldAsync, isPending: isDeleting } = useDeleteFormField();

  const updateDraft = (key: keyof FieldDraft, value: string | boolean) => setDraft((current) => ({ ...current, [key]: value }));
  const resetDraft = () => { setDraft(initialDraft); setEditingId(null); };
  const submitField = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const label = draft.label.trim();
    if (!label) return;
    const values = { label, type: draft.type, isRequired: draft.isRequired, description: draft.description.trim() || undefined, placeholder: draft.placeholder.trim() || undefined };
    if (editingId) await updateFormFieldAsync({ id: editingId, ...values });
    else await createFormFieldAsync({ formId, ...values });
    resetDraft();
  };
  const beginEdit = (field: (typeof fields)[number]) => {
    setEditingId(field.id);
    setDraft({ label: field.label, type: field.type, description: field.description ?? "", placeholder: field.placeholder ?? "", isRequired: field.isRequired });
  };
  const removeField = async (fieldId: string) => {
    if (!window.confirm("Delete this field? This cannot be undone.")) return;
    await deleteFormFieldAsync({ id: fieldId });
    if (editingId === fieldId) resetDraft();
  };

  return (
    <main className="min-h-screen bg-muted/30">
      <div className="mx-auto max-w-7xl space-y-8 p-4 md:p-8">
        <header className="space-y-4">
          <Link href="/dashboard/forms" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeftIcon className="size-4" /> All forms</Link>
          <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-medium uppercase tracking-[0.18em] text-primary">Form builder</p><h1 className="mt-1 text-3xl font-semibold tracking-tight">Build your fields</h1><p className="mt-2 text-muted-foreground">Create the questions respondents will answer.</p></div><Badge variant="outline" className="font-mono">{formId.slice(0, 8)}...</Badge></div>
        </header>
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
          <Card><CardHeader className="border-b"><CardTitle>Field inventory</CardTitle><CardDescription>{fields.length} {fields.length === 1 ? "field" : "fields"} in this form</CardDescription></CardHeader><CardContent className="p-0">
            {isLoading && <p className="p-10 text-center text-sm text-muted-foreground">Loading fields...</p>}
            {isError && <p className="p-10 text-center text-sm text-destructive">Could not load this form&apos;s fields.</p>}
            {!isLoading && !isError && fields.length === 0 && <div className="p-14 text-center"><p className="font-medium">No fields yet</p><p className="mt-2 text-sm text-muted-foreground">Use the panel to add your first question.</p></div>}
            {!isLoading && !isError && fields.length > 0 && <div className="divide-y">{fields.map((field, index) => <div key={field.id} className="group flex items-center gap-4 px-5 py-4 hover:bg-muted/40"><span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">{index + 1}</span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><p className="truncate font-medium">{field.label}</p>{field.isRequired && <Badge variant="outline" className="text-[10px]">Required</Badge>}</div><p className="mt-1 text-sm text-muted-foreground">{fieldTypeLabels[field.type]}{field.description ? ` · ${field.description}` : ""}</p></div><div className="flex shrink-0 gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100"><Button variant="ghost" size="icon-sm" aria-label={`Edit ${field.label}`} onClick={() => beginEdit(field)}><PencilIcon className="size-4" /></Button><Button variant="ghost" size="icon-sm" aria-label={`Delete ${field.label}`} disabled={isDeleting} onClick={() => removeField(field.id)}><Trash2Icon className="size-4 text-destructive" /></Button></div></div>)}</div>}
          </CardContent></Card>
          <Card className="h-fit"><CardHeader><CardTitle>{editingId ? "Edit field" : "Add a field"}</CardTitle><CardDescription>{editingId ? "Update this question and save it." : "Add a question to your form."}</CardDescription></CardHeader><CardContent><form onSubmit={submitField} className="space-y-4">
            <div className="space-y-2"><Label htmlFor="field-label">Question label</Label><Input id="field-label" value={draft.label} onChange={(event) => updateDraft("label", event.target.value)} placeholder="What is your name?" required /></div>
            <div className="space-y-2"><Label htmlFor="field-type">Answer type</Label><Select value={draft.type} onValueChange={(value) => updateDraft("type", value as FieldType)}><SelectTrigger id="field-type" className="w-full"><SelectValue /></SelectTrigger><SelectContent>{fieldTypes.map((type) => <SelectItem key={type} value={type}>{fieldTypeLabels[type]}</SelectItem>)}</SelectContent></Select></div>
            <div className="space-y-2"><Label htmlFor="field-description">Description <span className="font-normal text-muted-foreground">(optional)</span></Label><Textarea id="field-description" value={draft.description} onChange={(event) => updateDraft("description", event.target.value)} placeholder="Add context for respondents" rows={3} /></div>
            <div className="space-y-2"><Label htmlFor="field-placeholder">Placeholder <span className="font-normal text-muted-foreground">(optional)</span></Label><Input id="field-placeholder" value={draft.placeholder} onChange={(event) => updateDraft("placeholder", event.target.value)} placeholder="Type your answer" /></div>
            <label className="flex items-center gap-3 rounded-lg border p-3 text-sm"><Checkbox checked={draft.isRequired} onCheckedChange={(checked) => updateDraft("isRequired", checked === true)} /><span><span className="font-medium">Required field</span><span className="block text-xs text-muted-foreground">Respondents must answer it</span></span></label>
            <div className="flex gap-2"><Button type="submit" disabled={isCreating || isUpdating || !draft.label.trim()} className="flex-1">{isCreating || isUpdating ? "Saving..." : editingId ? "Save changes" : <><PlusIcon className="size-4" /> Add field</>}</Button>{editingId && <Button type="button" variant="outline" onClick={resetDraft}>Cancel</Button>}</div>
          </form></CardContent></Card>
        </div>
      </div>
    </main>
  );
}