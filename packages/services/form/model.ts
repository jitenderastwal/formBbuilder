import {z} from "zod";

export const createFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  createby: z.string().uuid("Invalid user ID"),
});

export type CreateFormSchema = z.infer<typeof createFormSchema>;