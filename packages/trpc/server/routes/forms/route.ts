import { protectedProcedure, publicProcedure, router } from "../../trpc";
import { createFieldInputModel, createFieldOutputModel, CreateFormInputSchema, CreateFormOutputSchema, createFormSubmissionInputModel, createFormSubmissionOutputModel, getFormSubmissionsInputModel, getFormSubmissionsOutputModel, getPublicFormInputModel, ListFormsInputSchema, ListFormsOutputSchema, deleteFieldOutputModel, formFieldIdInputModel, formFieldOutputModel, listFormFieldsInputModel, listFormFieldsOutputModel, publicFormOutputModel, updateFieldInputModel } from "./model";
import FormService from "@repo/services/form";
import { generatePath } from "../../utils/path-generator";
import FormFieldService from "@repo/services/form-field";
import FormSubmissionService from "@repo/services/form-submission";

const TAGS = ["Form"]; 
const getPath = generatePath("/forms");
export const formsRouter = router({
    createForm: protectedProcedure.meta({ openapi: { method: "POST", path: "/forms", tags: ["Forms"] ,protect: true} })
        .input(CreateFormInputSchema)
        .output(CreateFormOutputSchema)
        .mutation(async ({ input, ctx }) => {
            const { title, description } = input;
            
            const { id } = await new FormService().createForm({
                title,
                description,  
                createby: ctx.user.id,
            });
            return { id };  
        }),

    listFormsByUserId: protectedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/forms",
        tags: ["Forms"],
        protect: true,
      },
    })
    .input(ListFormsInputSchema)
    .output( ListFormsOutputSchema)
    .query(async ({ ctx }) => {
       const forms = await new FormService().listFormsByUserId({
        userId: ctx.user.id,
      })
      return forms;
      }),

    getPublicForm: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/public/forms/{formId}",
        tags: ["Public Forms"],
        protect: false,
      },
    })
    .input(getPublicFormInputModel)
    .output(publicFormOutputModel)
    .query(async ({ input }) => new FormService().getPublicForm(input)),

    createPublicFormSubmission: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/public/forms/{formId}/submissions",
        tags: ["Public Forms"],
        protect: false,
      },
    })
    .input(createFormSubmissionInputModel)
    .output(createFormSubmissionOutputModel)
    .mutation(async ({ input }) => new FormSubmissionService().createSubmission(input)),

    getFormSubmissions: protectedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/forms/{formId}/submissions",
        tags: ["Forms"],
        protect: true,
      },
    })
    .input(getFormSubmissionsInputModel)
    .output(getFormSubmissionsOutputModel)
    .query(async ({ input, ctx }) => new FormSubmissionService().getSubmissionsByFormId({
      ...input,
      userId: ctx.user.id,
    })),

      createFormField: protectedProcedure
      .meta({
        openapi: {
          method: "POST",
          path: "/forms/{formId}/fields",
          tags: ["Forms"],
          protect: true,
        },
      })
      .input(createFieldInputModel)
      .output(createFieldOutputModel)
      .mutation(async ({ input }) => {
        return await new FormFieldService().createFormField(input)
        }),

      getFormField: protectedProcedure
      .meta({ openapi: { method: "GET", path: "/forms/fields/{id}", tags: ["Forms"], protect: true } })
      .input(formFieldIdInputModel)
      .output(formFieldOutputModel)
      .query(async ({ input }) => new FormFieldService().getFormField(input)),

      listFormFields: protectedProcedure
      .meta({ openapi: { method: "GET", path: "/forms/{formId}/fields", tags: ["Forms"], protect: true } })
      .input(listFormFieldsInputModel)
      .output(listFormFieldsOutputModel)
      .query(async ({ input }) => new FormFieldService().listFormFields(input)),

      updateFormField: protectedProcedure
      .meta({ openapi: { method: "PATCH", path: "/forms/fields/{id}", tags: ["Forms"], protect: true } })
      .input(updateFieldInputModel)
      .output(formFieldOutputModel)
      .mutation(async ({ input }) => new FormFieldService().updateFormField(input)),

      deleteFormField: protectedProcedure
      .meta({ openapi: { method: "DELETE", path: "/forms/fields/{id}", tags: ["Forms"], protect: true } })
      .input(formFieldIdInputModel)
      .output(deleteFieldOutputModel)
      .mutation(async ({ input }) => new FormFieldService().deleteFormField(input)),
      })

