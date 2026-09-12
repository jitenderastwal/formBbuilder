import { and, db, desc, eq } from "@repo/database";
import { formFieldsTable } from "@repo/database/models/formlist";
import { formSubmissionTable } from "@repo/database/models/formsubmission";
import { formsTable } from "@repo/database/models/form";
import {
  createFormSubmissionSchema,
  type CreateFormSubmissionSchema,
  getFormSubmissionsForUserSchema,
  type GetFormSubmissionsForUserSchema,
} from "./model";

class FormSubmissionService {
  public async createSubmission(payload: CreateFormSubmissionSchema) {
    const { formId, values } = await createFormSubmissionSchema.parseAsync(payload);

    const fields = await db
      .select({
        id: formFieldsTable.id,
        isRequired: formFieldsTable.isRequired,
      })
      .from(formFieldsTable)
      .where(eq(formFieldsTable.formId, formId));

    if (fields.length === 0) {
      throw new Error("Form has no fields");
    }

    const fieldIds = new Set(fields.map((field) => field.id));
    const submittedIds = new Set(values.map((value) => value.formFieldId));
    const unknownField = values.find((value) => !fieldIds.has(value.formFieldId));

    if (unknownField) {
      throw new Error("Submission contains a field that does not belong to this form");
    }

    const missingRequiredField = fields.find(
      (field) => field.isRequired && !submittedIds.has(field.id),
    );

    if (missingRequiredField) {
      throw new Error("A required field is missing");
    }

    const result = await db
      .insert(formSubmissionTable)
      .values({ formId, values })
      .returning({ id: formSubmissionTable.id });

    if (!result[0]?.id) {
      throw new Error("Failed to create form submission");
    }

    return { id: result[0].id };
  }

  public async getSubmissionsByFormId(payload: GetFormSubmissionsForUserSchema) {
    const { formId, userId } = await getFormSubmissionsForUserSchema.parseAsync(payload);

    return db
      .select({
        id: formSubmissionTable.id,
        formId: formSubmissionTable.formId,
        values: formSubmissionTable.values,
        createdAt: formSubmissionTable.createdAt,
        updatedAt: formSubmissionTable.updatedAt,
      })
      .from(formSubmissionTable)
      .innerJoin(formsTable, eq(formSubmissionTable.formId, formsTable.id))
      .where(and(
        eq(formsTable.createdBy, userId),
        eq(formSubmissionTable.formId, formId),
      ))
      .orderBy(desc(formSubmissionTable.createdAt));
  }
}

export default FormSubmissionService;
