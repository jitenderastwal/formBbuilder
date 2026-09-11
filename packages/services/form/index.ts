import {db,eq} from "@repo/database";
import {formsTable} from "@repo/database/schema";
import {type CreateFormSchema,createFormSchema, listFormsByUserIdSchema, ListFormsByUserIdSchema} from "./model";


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
}
export default FormService;