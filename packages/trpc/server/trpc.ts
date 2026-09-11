import { initTRPC, TRPCError } from "@trpc/server";
import { OpenApiMeta } from "trpc-to-openapi";

import { createContext } from "./context";
import { userService } from "./services";
import { getAuthenticationCookie } from "./utils/cookies";

export const tRPCContext = initTRPC
  .meta<OpenApiMeta>()
  .context<typeof createContext>()
  .create({});

export const router = tRPCContext.router;

export const publicProcedure = tRPCContext.procedure;

  export const protectedProcedure = tRPCContext.procedure.use(async options => {
    const { ctx } = options;
    
    const userToken= getAuthenticationCookie(ctx);
    if (!userToken) {
      throw new TRPCError({ code: "UNAUTHORIZED", message: "User is not authenticated" });
    }
    
      const {id} = await userService.verifyandDecodedUserToken(userToken);
      return options.next({
        ctx: {
          ...ctx,
          user: {id},
        },
      });  
   
  }); 