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

export const getPublicFormInputModel = z.object({
  formId: z.string().uuid("Invalid form ID"),
});

export const createFormSubmissionInputModel = z.object({
  formId: z.string().uuid("Invalid form ID"),
  values: z.array(z.object({
    formFieldId: z.string().uuid("Invalid form field ID"),
    value: z.string(),
  })),
});

export const createFormSubmissionOutputModel = z.object({
  id: z.string().uuid(),
});

export const getFormSubmissionsInputModel = z.object({
  formId: z.string().uuid("Invalid form ID"),
});

export const getFormSubmissionsOutputModel = z.array(z.object({
  id: z.string().uuid(),
  formId: z.string().uuid().nullable(),
  values: z.array(z.object({
    formFieldId: z.string().uuid(),
    value: z.string(),
  })).nullable(),
  createdAt: z.date().nullable(),
  updatedAt: z.date().nullable(),
}));

//form field schemas
const fieldTypeEnum = z.enum(['TEXT', 'NUMBER', 'EMAIL', 'YES_NO', 'PASSWORD'])

export const createFieldInputModel = z.object({
    formId: z.string().uuid().describe('UUID of the form'),
    label: z.string().max(100).describe('Display label for the field'),
    type: fieldTypeEnum.describe('Type of the field'),
    description: z.string().optional(),
    placeholder: z.string().optional(),
    isRequired: z.boolean().optional().default(false),
})
  
export const createFieldOutputModel = z.object({
    id: z.string(),
    labelKey: z.string(),
    index: z.string(),
})

  export const formFieldOutputModel = z.object({
    id: z.string().uuid(),
    label: z.string(),
    labelKey: z.string(),
    description: z.string().nullable(),
    placeholder: z.string().nullable(),
    isRequired: z.boolean(),
    index: z.string(),
    type: fieldTypeEnum,
    formId: z.string().uuid().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable(),
  })

  export const listFormFieldsInputModel = z.object({
    formId: z.string().uuid(),
  })

  export const listFormFieldsOutputModel = z.array(formFieldOutputModel)

  export const publicFormOutputModel = z.object({
    id: z.string().uuid(),
    title: z.string(),
    description: z.string().nullable(),
    fields: z.array(z.object({
      id: z.string().uuid(),
      label: z.string(),
      labelKey: z.string(),
      description: z.string().nullable(),
      placeholder: z.string().nullable(),
      isRequired: z.boolean(),
      index: z.string(),
      type: fieldTypeEnum,
    })),
  })

  export const formFieldIdInputModel = z.object({
    id: z.string().uuid(),
  })

  export const deleteFieldOutputModel = z.object({
    id: z.string().uuid(),
  })

  export const updateFieldInputModel = formFieldIdInputModel.extend({
    label: z.string().min(1).max(100).optional(),
    type: fieldTypeEnum.optional(),
    description: z.string().optional(),
    placeholder: z.string().optional(),
    isRequired: z.boolean().optional(),
  })
