import { db ,eq} from "@repo/database";
import { usersTable } from "@repo/database/schema";
import { env } from "../env";
import { googleOAuth2Client } from "../clients/google-oauth";
import {type CreateUserInputSchema,createUserInputSchema} from "./model";
import { randomBytes, createHmac } from 'node:crypto'
import {type GnerateUserTokenPayload,generateUserTokenPayload} from "./model"
import * as JWT from 'jsonwebtoken';


class UserService {

  public async getUserInfo(id: string) {
    const user = await db.select(
      {
        id: usersTable.id,
        fullName: usersTable.fullName,
        email: usersTable.email,
      }
    ).from(usersTable).where(eq(usersTable.id, id)).limit(1);
    if (!user || user.length === 0) {
      throw new Error("User not found");
    }
    return user[0]!;
  }

  private async checkUserExists(email: string): Promise<boolean> {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email));
    console.log(user)
    if(user){
      return true;
    }
    return false;
  }

  private async generateUserToken(payload:GnerateUserTokenPayload){
    const {id} = await generateUserTokenPayload.parseAsync(payload);
    const token = JWT.sign({ id }, env.JWT_SECRET,);
        return { token }
  }

  private async verifyUserToken(token: string) {
    try {
      const decoded = JWT.verify(token, env.JWT_SECRET) as GnerateUserTokenPayload;
      return decoded;
    } catch (error) {
      throw new Error("Invalid token");
    }
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    const crypto = await import("crypto");
    return new Promise((resolve, reject) => {
      crypto.pbkdf2(password, salt, 100000, 64, "sha512", (err, derivedKey) => {
        if (err) reject(err);
        else resolve(derivedKey.toString("hex"));
      });
    });
  }

  public async createUser(payload: CreateUserInputSchema) { 
  const {fullName, email, password} = await createUserInputSchema.parseAsync(payload);
  
  // Check if the user already exists
  const userExists = await this.checkUserExists(email);
  if (userExists) {
    throw new Error("User already exists");
  }

  // generate salt and hash the password
  const salt = randomBytes(16).toString("hex");
  const hashedPassword = await this.hashPassword(password, salt);

  // Insert the new user into the database  
  const newUser = await db.insert(usersTable).values({
    fullName,
    email,
    password: hashedPassword,
    salt,
  }).returning({id: usersTable.id});

  if(!newUser || newUser.length === 0 || !newUser[0]?.id) {
    throw new Error("Failed to create user");
  }
  const { token } = await this.generateUserToken({ id: newUser[0].id });

  return { id: newUser[0].id, token };
} 

public async signInUserWithEmailAndPassword(payload: { email: string; password: string }) {
  const { email, password } = payload;
  
  // Check if the user exists
  const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email));
  if (!user) {
    throw new Error("User does not exist");
  }

  // Verify the password
  const salt = user.salt;
  const hashedPassword = await this.hashPassword(password, salt);
  if (hashedPassword !== user.password) {
    throw new Error("Invalid password");
  }

  // Generate a token for the user
  const { token } = await this.generateUserToken({ id: user.id });
  return { token , id:user.id };

}

public async verifyandDecodedUserToken(token: string) {
  // Verify the token
  const decoded = await this.verifyUserToken(token);
  const { id } = decoded;
  return { id };

}
}
export default UserService;
