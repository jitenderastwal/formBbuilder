import { asc, db, eq, max } from '@repo/database'
import { formFieldsTable } from '@repo/database/models/formlist'
import {
    type FormFieldIdSchema,
    type FormFieldInputSchema,
    type FormIdSchema,
    type UpdateFormFieldSchema,
    formFieldIdSchema,
    formFieldInputSchema,
    formIdSchema,
    updateFormFieldSchema,
} from './model'

function toLabelKey(label: string): string {
    return label
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_|_$/g, '')
}

class FormFieldService {

    private async getFieldById(id: string) {
        const result = await db
            .select()
            .from(formFieldsTable)
            .where(eq(formFieldsTable.id, id))

        if (!result[0]) {
            throw new Error('Form field not found')
        }
        return result[0]
    }

    private async getNextIndex(formId: string): Promise<string> {
        const result = await db
            .select({ maxIndex: max(formFieldsTable.index) })
            .from(formFieldsTable)
            .where(eq(formFieldsTable.formId, formId))

        const current = result[0]?.maxIndex
        const next = current ? parseFloat(current) + 1 : 1
        return next.toFixed(2)
    }


    public async createFormField(payload: FormFieldInputSchema) {
        const { label, type, isRequired, placeholder, description, formId } = await formFieldInputSchema.parseAsync(payload);
        const labelKey = toLabelKey(label);
        const index = await this.getNextIndex(formId);
        const result = await db.insert(formFieldsTable).values({
            label, labelKey, type, formId, description, placeholder, isRequired, index
        }).returning({ id: formFieldsTable.id });

        if(!result || !result[0]?.id || result[0].id === null) {
            throw new Error("Failed to create form field");
        }
        return {id: result[0].id, labelKey, index};
    }

    public async getFormField(payload: FormFieldIdSchema) {
        const { id } = await formFieldIdSchema.parseAsync(payload)
        return this.getFieldById(id)
    }

    public async listFormFields(payload: FormIdSchema) {
        const { formId } = await formIdSchema.parseAsync(payload)
        return db
            .select()
            .from(formFieldsTable)
            .where(eq(formFieldsTable.formId, formId))
            .orderBy(asc(formFieldsTable.index))
    }

    public async updateFormField(payload: UpdateFormFieldSchema) {
        const { id, label, type, isRequired, placeholder, description } =
            await updateFormFieldSchema.parseAsync(payload)
        const values = {
            ...(label !== undefined && { label, labelKey: toLabelKey(label) }),
            ...(type !== undefined && { type }),
            ...(isRequired !== undefined && { isRequired }),
            ...(placeholder !== undefined && { placeholder }),
            ...(description !== undefined && { description }),
        }

        const result = await db
            .update(formFieldsTable)
            .set(values)
            .where(eq(formFieldsTable.id, id))
            .returning({ id: formFieldsTable.id })

        if (!result[0]) {
            throw new Error('Form field not found')
        }
        return this.getFieldById(result[0].id)
    }

    public async deleteFormField(payload: FormFieldIdSchema) {
        const { id } = await formFieldIdSchema.parseAsync(payload)
        const result = await db
            .delete(formFieldsTable)
            .where(eq(formFieldsTable.id, id))
            .returning({ id: formFieldsTable.id })

        if (!result[0]) {
            throw new Error('Form field not found')
        }
        return { id: result[0].id }
    }
}

export default FormFieldService