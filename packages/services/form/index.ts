import { asc, db, eq } from "@repo/database";
import {formsTable} from "@repo/database/schema";
import { formFieldsTable } from "@repo/database/models/formlist";
import { type CreateFormSchema, createFormSchema, getPublicFormSchema, listFormsByUserIdSchema, ListFormsByUserIdSchema, type GetPublicFormSchema } from "./model";


class FormService {
  public async createForm(payload: CreateFormSchema) {
    const { title, description, createby } = await createFormSchema.parseAsync(payload);
    const result = await db.insert(formsTable).values({
      title,
      description,
      createdBy: createby,
    }).returning({ id: formsTable.id });  
    
    if(!result || !result[0]?.id || result[0].id === null) {
      throw new Error("Failed to create form");
    }
    return {id: result[0].id};
  }

  public async listFormsByUserId(payload: ListFormsByUserIdSchema) {
    const { userId } = await listFormsByUserIdSchema.parseAsync(payload);

    const result = await db
      .select({
        id: formsTable.id,
        title: formsTable.title,
        description: formsTable.description,
        createdBy: formsTable.createdBy,
        createdAt: formsTable.createdat,
        updatedAt: formsTable.updatedat,
      })
      .from(formsTable)
      .where(eq(formsTable.createdBy, userId));
      return result;
  }

  public async getPublicForm(payload: GetPublicFormSchema) {
    const { formId } = await getPublicFormSchema.parseAsync(payload);

    const rows = await db
      .select({
        form: {
          id: formsTable.id,
          title: formsTable.title,
          description: formsTable.description,
        },
        field: {
          id: formFieldsTable.id,
          label: formFieldsTable.label,
          labelKey: formFieldsTable.labelKey,
          description: formFieldsTable.description,
          placeholder: formFieldsTable.placeholder,
          isRequired: formFieldsTable.isRequired,
          index: formFieldsTable.index,
          type: formFieldsTable.type,
        },
      })
      .from(formsTable)
      .leftJoin(formFieldsTable, eq(formFieldsTable.formId, formsTable.id))
      .where(eq(formsTable.id, formId))
      .orderBy(asc(formFieldsTable.index));

    if (!rows[0]) {
      throw new Error("Form not found");
    }

    return {
      ...rows[0].form,
      fields: rows.flatMap(({ field }) => field ? [field] : []),
    };
  }
}
export default FormService;