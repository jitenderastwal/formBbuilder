import { z } from "zod";

export const createFormSubmissionSchema = z.object({
  formId: z.string().uuid("Invalid form ID"),
  values: z.array(
    z.object({
      formFieldId: z.string().uuid("Invalid form field ID"),
      value: z.string(),
    }),
  ),
});

export type CreateFormSubmissionSchema = z.infer<
  typeof createFormSubmissionSchema
>;

export const getFormSubmissionsSchema = z.object({
  formId: z.string().uuid("Invalid form ID"),
});

export const getFormSubmissionsForUserSchema = getFormSubmissionsSchema.extend({
  userId: z.string().uuid("Invalid user ID"),
});

export type GetFormSubmissionsSchema = z.infer<typeof getFormSubmissionsSchema>;
export type GetFormSubmissionsForUserSchema = z.infer<typeof getFormSubmissionsForUserSchema>;
