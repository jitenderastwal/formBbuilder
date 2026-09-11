import z from "zod";

export const CreateFormInputSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
});

export const CreateFormOutputSchema = z.object({
  id: z.string().uuid("Invalid form ID"),
});

