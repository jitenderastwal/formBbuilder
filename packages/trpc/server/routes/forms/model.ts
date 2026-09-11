import z from "zod";

export const CreateFormInputSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
}); 

export const CreateFormOutputSchema = z.object({
  id: z.string().uuid("Invalid form ID"),
});

export const ListFormsInputSchema = z.object({});
 
export const ListFormsOutputSchema = z.array(
  z.object({
    id: z.string().uuid(),
    title: z.string(),
    description: z.string().nullable().optional(),
    createdBy: z.string().uuid(),
    createdAt: z.date(),
    updatedAt: z.date(),
  }),
);

