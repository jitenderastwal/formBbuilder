"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeftIcon, FileTextIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetFormSubmissions, useListFormFields } from "~/hooks/api/form";

export default function FormSubmissionsPage() {
  const { id: formId } = useParams<{ id: string }>();
  const {
    fields,
    isLoading: isLoadingFields,
    isError: isFieldsError,
    error: fieldsError,
  } = useListFormFields(formId);
  const {
    submissions,
    isLoading: isLoadingSubmissions,
    isError: isSubmissionsError,
    error: submissionsError,
  } = useGetFormSubmissions(formId);

  const isLoading = isLoadingFields || isLoadingSubmissions;
  const isError = isFieldsError || isSubmissionsError;

  return (
    <main className="min-h-screen bg-muted/30">
      <div className="mx-auto max-w-7xl space-y-8 p-4 md:p-8">
        <header className="space-y-4">
          <Link
            href={`/dashboard/forms/${formId}`}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeftIcon className="size-4" />
            Back to form builder
          </Link>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-primary">
                Form responses
              </p>
              <h1 className="mt-1 text-3xl font-semibold tracking-tight">Submissions</h1>
              <p className="mt-2 text-muted-foreground">
                Review the answers submitted to this form.
              </p>
            </div>
            <Badge variant="outline" className="font-mono">
              {formId.slice(0, 8)}...
            </Badge>
          </div>
        </header>

        <Card>
          <CardHeader className="border-b">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <CardTitle>All submissions</CardTitle>
                <CardDescription>
                  {submissions.length} {submissions.length === 1 ? "response" : "responses"}
                </CardDescription>
              </div>
              <Badge variant="secondary">Newest first</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading && (
              <p className="p-10 text-center text-sm text-muted-foreground">
                Loading fields and submissions...
              </p>
            )}

            {isError && !isLoading && (
              <div className="space-y-3 p-10 text-center text-sm">
                <p className="text-destructive">Could not load the form fields or submissions.</p>
                <p className="text-muted-foreground">
                  {fieldsError?.message ?? submissionsError?.message ?? "The API returned an unknown error."}
                </p>
                {(fieldsError?.data?.code === "UNAUTHORIZED" || submissionsError?.data?.code === "UNAUTHORIZED") && (
                  <Link href="/login" className="inline-block text-primary underline underline-offset-4">
                    Sign in to view submissions
                  </Link>
                )}
              </div>
            )}

            {!isLoading && !isError && fields.length === 0 && (
              <div className="flex flex-col items-center gap-3 p-14 text-center">
                <FileTextIcon className="size-8 text-muted-foreground" />
                <div>
                  <p className="font-medium">This form has no fields</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Add fields before reviewing submissions.
                  </p>
                </div>
              </div>
            )}

            {!isLoading && !isError && fields.length > 0 && submissions.length === 0 && (
              <div className="flex flex-col items-center gap-3 p-14 text-center">
                <FileTextIcon className="size-8 text-muted-foreground" />
                <div>
                  <p className="font-medium">No submissions yet</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Responses will appear here after someone submits the form.
                  </p>
                </div>
              </div>
            )}

            {!isLoading && !isError && fields.length > 0 && submissions.length > 0 && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-44">Submitted</TableHead>
                    {fields.map((field) => (
                      <TableHead key={field.id} className="min-w-40">
                        {field.label}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions.map((submission) => {
                    const answers = new Map(
                      (submission.values ?? []).map((answer) => [
                        answer.formFieldId,
                        answer.value,
                      ]),
                    );

                    return (
                      <TableRow key={submission.id}>
                        <TableCell className="text-muted-foreground">
                          {submission.createdAt
                            ? new Date(submission.createdAt).toLocaleString()
                            : "Unknown"}
                        </TableCell>
                        {fields.map((field) => (
                          <TableCell key={field.id} className="max-w-xs whitespace-normal">
                            {answers.get(field.id) || (
                              <span className="text-muted-foreground">No answer</span>
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
