import {z} from 'zod';

export const formFieldInputSchema = z.object({
  label: z.string().min(1, {message: 'Label is required'}),
  formId: z.string().min(1, {message: 'Form ID is required'}),
    type: z.enum(['TEXT', 'NUMBER', 'EMAIL', 'YES_NO', 'PASSWORD']),
    isRequired: z.boolean().optional(),
    placeholder: z.string().optional(),
    description: z.string().optional(),
});

export const formFieldIdSchema = z.object({
  id: z.string().uuid('Invalid form field ID'),
});

export const updateFormFieldSchema = formFieldIdSchema.extend({
  label: z.string().min(1).max(100).optional(),
  type: z.enum(['TEXT', 'NUMBER', 'EMAIL', 'YES_NO', 'PASSWORD']).optional(),
  isRequired: z.boolean().optional(),
  placeholder: z.string().optional(),
  description: z.string().optional(),
}).refine(
  ({ label, type, isRequired, placeholder, description }) =>
    label !== undefined || type !== undefined || isRequired !== undefined ||
    placeholder !== undefined || description !== undefined,
  { message: 'At least one field value is required' },
);

export type FormFieldInputSchema = z.infer<typeof formFieldInputSchema>;
export type FormFieldIdSchema = z.infer<typeof formFieldIdSchema>;
export type UpdateFormFieldSchema = z.infer<typeof updateFormFieldSchema>;