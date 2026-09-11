import z from "zod";

export const createUserInputSchema = z.object({
  fullName: z.string().describe("The full name of the user"),
  email: z.string().email().describe("The email address of the user"),
  password: z.string().min(8).describe("The password of the user"),
});

export type CreateUserInputSchema = z.infer<typeof createUserInputSchema>;

export const createUserOutputSchema = z.object({
  id: z.string().uuid(),
});

export type CreateUserOutputSchema = z.infer<typeof createUserOutputSchema>;

export const signInUserWithEmailAndPasswordSchema = z.object({
  email: z.string().email().describe("The email address of the user"),
  password: z.string().min(8).describe("The password of the user"),
});

export type SignInUserWithEmailAndPasswordSchema = z.infer<typeof signInUserWithEmailAndPasswordSchema>;

export const signInUserOutputSchema = z.object({
  id: z.string().uuid()
});

export type SignInUserOutputSchema = z.infer<typeof signInUserOutputSchema>;

export const getloggedInUserInfoOutputSchema = z.object({
  id: z.string().uuid(),
  fullName: z.string(),
  email: z.string().email(),
});

export type GetloggedInUserInfoOutputSchema = z.infer<typeof getloggedInUserInfoOutputSchema>;

export const getloggedInUserInfoInputSchema = z.undefined();

export type GetloggedInUserInfoInputSchema = z.infer<typeof getloggedInUserInfoInputSchema>;