
import { userService } from "../../services";
import { protectedProcedure, publicProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import { createUserInputSchema ,createUserOutputSchema,signInUserWithEmailAndPasswordSchema,signInUserOutputSchema,  getloggedInUserInfoOutputSchema, getloggedInUserInfoInputSchema} from "./model";
import {getAuthenticationCookie, setAuthenticationCookie } from "../../utils/cookies";

const TAGS = ["Authentication"];
const getPath = generatePath("/authentication");
 
export const authRouter = router({
  createUserWithInputSchema: publicProcedure
    .meta({ openapi: { method: "POST", path: getPath("/users"), tags: TAGS } })
    .input(createUserInputSchema)
    .output(createUserOutputSchema)
    .mutation(async ({ input , ctx }) => {
      const {fullName, email, password} = await createUserInputSchema.parseAsync(input);
      const { id, token } = await userService.createUser({ fullName, email, password });
      setAuthenticationCookie(ctx, token);
      return { id};
    }),

  signInUserWithEmailAndPassword: publicProcedure
    .meta({ openapi: { method: "POST", path: getPath("/users/signin"), tags: TAGS } })
    .input(signInUserWithEmailAndPasswordSchema)
    .output(signInUserOutputSchema)
    .mutation(async ({ input , ctx }) => {
      const {email, password} = await signInUserWithEmailAndPasswordSchema.parseAsync(input);
      const { token, id } = await userService.signInUserWithEmailAndPassword({ email, password });
      setAuthenticationCookie(ctx, token);
      return { id };
    }), 

  getloggedInUserInfo: protectedProcedure 
    .meta({ openapi: { method: "GET", path: getPath("/users/me"), tags: TAGS } })
    .input(getloggedInUserInfoInputSchema)
    .output(getloggedInUserInfoOutputSchema)
    .query(async ({ ctx }) => {
      
      const { id, fullName, email } = await userService.getUserInfo(ctx.user.id);
      return { id, fullName, email };
    }),  

  }  );
