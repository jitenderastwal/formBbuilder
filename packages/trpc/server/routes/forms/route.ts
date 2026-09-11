import { protectedProcedure, publicProcedure, router } from "../../trpc";
import { CreateFormInputSchema, CreateFormOutputSchema, ListFormsInputSchema, ListFormsOutputSchema } from "./model";
import FormService from "@repo/services/form";
import { generatePath } from "../../utils/path-generator";

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
    
})  
  