import {z} from "zod";

export const createFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  createby: z.string().uuid("Invalid user ID"),
});

export type CreateFormSchema = z.infer<typeof createFormSchema>;

export const listFormsByUserIdSchema = z.object({
  userId: z.string().uuid("Invalid user ID"),
});


export type ListFormsByUserIdSchema = z.infer<
  typeof listFormsByUserIdSchema
>;

export const getPublicFormSchema = z.object({
  formId: z.string().uuid("Invalid form ID"),
});

export type GetPublicFormSchema = z.infer<typeof getPublicFormSchema>;