import {db} from "@repo/database";
import {formsTable} from "@repo/database/schema";
import {type CreateFormSchema,createFormSchema} from "./model";


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
}
export default FormService;