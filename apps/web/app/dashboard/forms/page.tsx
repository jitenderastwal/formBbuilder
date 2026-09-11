"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useCreateForm, useListForms } from "~/hooks/api/form";

export default function FormsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const { forms, isLoading, error: listError } = useListForms();
  const { createFormAsync, isPending, error: createError } = useCreateForm();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await createFormAsync({
        title: title.trim(),
        description: description.trim() || undefined,
      });

      setTitle("");
      setDescription("");
      setIsModalOpen(false);
    } catch {
      // Mutation error is displayed below.
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-slate-100">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Forms</h1>
          <p className="mt-2 text-slate-400">Manage your forms.</p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
        >
          Create new form
        </button>
      </div>

      <section className="overflow-hidden rounded-lg border border-slate-700 bg-slate-900">
        <table className="w-full text-left">
          <thead className="border-b border-slate-700 bg-slate-800">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-slate-400">
                  Loading forms...
                </td>
              </tr>
            )}

            {listError && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-red-400">
                  Failed to load forms.
                </td>
              </tr>
            )}

            {!isLoading && !listError && forms.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-slate-400">
                  No forms found.
                </td>
              </tr>
            )}

            {forms.map((form) => (
              <tr
                key={form.id}
                className="border-b border-slate-800 hover:bg-slate-800"
              >
                <td className="px-4 py-3 font-medium">{form.title}</td>
                <td className="px-4 py-3 text-slate-400">
                  {form.description || "No description"}
                </td>
                <td className="px-4 py-3 text-slate-400">
                  {new Date(form.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/dashboard/forms/${form.id}`}
                    className="rounded-md bg-slate-700 px-3 py-2 text-sm text-white hover:bg-blue-600"
                  >
                    Edit / Build
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-lg border border-slate-700 bg-slate-900 p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Create form</h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-2xl text-slate-400 hover:text-white"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                required
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Enter form title"
                className="w-full rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-white placeholder:text-slate-400"
              />

              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Enter form description"
                rows={4}
                className="w-full rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-white placeholder:text-slate-400"
              />

              {createError && (
                <p className="text-sm text-red-400">
                  Failed to create form.
                </p>
              )}

              <button
                type="submit"
                disabled={isPending}
                className="w-full rounded-md bg-blue-600 px-4 py-2 font-medium hover:bg-blue-700 disabled:opacity-50"
              >
                {isPending ? "Creating..." : "Create form"}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}