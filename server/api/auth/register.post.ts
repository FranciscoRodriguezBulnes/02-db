import { usersTable } from "~~/server/database/schema";
import { db } from "~~/server/database";
import { eq } from "drizzle-orm";
import type { InsertUser } from "~~/server/database/schema";
import { registerZodSchema } from "~~/shared/zod/register.schema";

export default eventHandler(async (event) => {
  const { email, password, username } = await readValidatedBody(
    event,
    registerZodSchema.parse,
  );

  // buscar si el usuario ya existe
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email));

  if (user) {
    throw createError({
      statusCode: 409,
      statusMessage: "User already exists with this email",
    });
  }

  // Buscar si el username ya existe
  const [existingUsername] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.username, username));

  if (existingUsername) {
    throw createError({
      statusCode: 409,
      statusMessage: "Username already exists",
    });
  }

  // Hash de la contraseña
  const hashedPassword = await hashPassword(password);

  // Insert the new user into the database
  const newUser: InsertUser = {
    email,
    username,
    password: hashedPassword,
  };

  await db.insert(usersTable).values(newUser);

  return {
    message: "User",
  };
});
