"use client";

import { useState, type FormEvent } from "react";
import { useCreateForm } from "~/hooks/api/form";

export default function FormsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const { createFormAsync, isPending, error } = useCreateForm();

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
      // The mutation error is displayed below the form.
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-slate-100">
      <div className="flex items-center justify-between">
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
//jfrrd3wsd
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-lg border border-slate-700 bg-slate-900 p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">
                Create form
              </h2>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-2xl text-slate-400 hover:text-white"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm text-slate-300">
                  Title
                </label>
                <input
                  required
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Enter form title"
                  className="w-full rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-white outline-none placeholder:text-slate-400 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-slate-300">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Enter form description"
                  rows={4}
                  className="w-full rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-white outline-none placeholder:text-slate-400 focus:border-blue-500"
                />
              </div>

              {error && (
                <p className="text-sm text-red-400">
                  Failed to create form. Please try again.
                </p>
              )}

              <button
                type="submit"
                disabled={isPending}
                className="w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
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