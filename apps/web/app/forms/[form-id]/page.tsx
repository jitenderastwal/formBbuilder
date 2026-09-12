"use client";

import { useParams } from "next/navigation";
import { useState, type FormEvent } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreatePublicFormSubmission, useGetPublicForm } from "~/hooks/api/form";

export default function PublicFormPage() {
	const { "form-id": formId } = useParams<{ "form-id": string }>();
	const { form, fields, isLoading, isError, error } = useGetPublicForm(formId);
	const [submitted, setSubmitted] = useState(false);
	const { createSubmissionAsync, isPending: isSubmitting, error: submissionError } = useCreatePublicFormSubmission();

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		const values = fields.map((field) => ({
			formFieldId: field.id,
			value: String(formData.get(field.labelKey) ?? ""),
		}));

		try {
			await createSubmissionAsync({ formId, values });
			setSubmitted(true);
		} catch {
			// The mutation error is rendered below the form.
		}
	};

	if (isLoading) {
		return <main className="flex min-h-screen items-center justify-center bg-muted/30 p-6 text-sm text-muted-foreground">Loading form...</main>;
	}

	if (isError || !form) {
		return <main className="flex min-h-screen items-center justify-center bg-muted/30 p-6"><Card className="w-full max-w-md"><CardHeader><CardTitle>Form unavailable</CardTitle><CardDescription>This form could not be found or is no longer available.</CardDescription>{error?.message && <p className="mt-2 text-xs text-destructive">{error.message}</p>}</CardHeader></Card></main>;
	}

	return (
		<main className="min-h-screen bg-muted/30 px-4 py-10 md:px-6">
			<div className="mx-auto max-w-2xl">
				<Card className="overflow-hidden shadow-sm">
					<div className="h-2 bg-primary" />
					<CardHeader className="space-y-3 p-6 md:p-8">
						<Badge variant="secondary" className="w-fit">Public form</Badge>
						<CardTitle className="text-3xl tracking-tight">{form.title}</CardTitle>
						{form.description && <CardDescription className="text-base leading-7">{form.description}</CardDescription>}
					</CardHeader>
					<CardContent className="p-6 pt-0 md:p-8 md:pt-0">
						{submitted ? (
							<div className="rounded-lg border border-green-500/30 bg-green-500/10 p-6 text-center">
								<h2 className="font-semibold">Thanks for your response</h2>
								<p className="mt-2 text-sm text-muted-foreground">Your answers have been recorded locally for now.</p>
								<Button type="button" variant="outline" className="mt-5" onClick={() => setSubmitted(false)}>Submit another response</Button>
							</div>
						) : fields.length === 0 ? (
							<p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">This form does not have any questions yet.</p>
						) : (
							<form onSubmit={handleSubmit} className="space-y-7">
								{fields.map((field) => {
									const inputId = `field-${field.id}`;
									const descriptionId = `${inputId}-description`;
									return (
										<div key={field.id} className="space-y-2">
											<Label htmlFor={inputId} className="text-sm font-medium">
												{field.label}{field.isRequired && <span className="ml-1 text-destructive" aria-hidden="true">*</span>}
												{field.isRequired && <span className="sr-only"> required</span>}
											</Label>
											{field.description && <p id={descriptionId} className="text-sm text-muted-foreground">{field.description}</p>}
											{field.type === "YES_NO" ? (
												<div className="flex items-center gap-6 pt-1" aria-describedby={field.description ? descriptionId : undefined}>
													<label className="flex items-center gap-2 text-sm"><input type="radio" name={field.labelKey} value="yes" required={field.isRequired} />Yes</label>
													<label className="flex items-center gap-2 text-sm"><input type="radio" name={field.labelKey} value="no" required={field.isRequired} />No</label>
												</div>
											) : field.type === "TEXT" && field.description?.toLowerCase().includes("long") ? (
												<Textarea id={inputId} name={field.labelKey} placeholder={field.placeholder ?? ""} required={field.isRequired} aria-describedby={field.description ? descriptionId : undefined} rows={4} />
											) : field.type === "PASSWORD" ? (
												<Input id={inputId} name={field.labelKey} type="password" placeholder={field.placeholder ?? ""} required={field.isRequired} aria-describedby={field.description ? descriptionId : undefined} />
											) : (
												<Input id={inputId} name={field.labelKey} type={field.type === "NUMBER" ? "number" : field.type === "EMAIL" ? "email" : "text"} placeholder={field.placeholder ?? ""} required={field.isRequired} aria-describedby={field.description ? descriptionId : undefined} />
											)}
										</div>
									);
								})}
								<div className="flex items-center justify-between gap-4 border-t pt-6">
									<p className="text-xs text-muted-foreground"><span className="text-destructive">*</span> Required</p>
									{submissionError && <p className="text-sm text-destructive">{submissionError.message}</p>}
									<Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Submitting..." : "Submit response"}</Button>
								</div>
							</form>
						)}
					</CardContent>
				</Card>
				<p className="mt-5 text-center text-xs text-muted-foreground">Powered by Streamyst</p>
			</div>
		</main>
	);
}
