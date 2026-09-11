import { z } from "zod";

export const createUserInputSchema = z.object({
  fullName: z.string().describe("The full name of the user"),
  email: z.string().email().describe("The email address of the user"),
  password: z.string().min(8).describe("The password of the user"),
});


export type CreateUserInputSchema = z.infer<typeof createUserInputSchema>;

export const generateUserTokenPayload=z.object({
  id: z.string().describe('uuid of the user'),
})

export type GnerateUserTokenPayload=z.infer<typeof generateUserTokenPayload>;

export const signInUserWithEmailAndPasswordInput=z.object({
  email: z.string().email().describe("The email address of the user"),
  password: z.string().min(8).describe("The password of the user"),
})

export type SignInUserWithEmailAndPasswordInput=z.infer<typeof signInUserWithEmailAndPasswordInput>

