import { db } from "~~/server/database";
import { usersTable } from "~~/server/database/schema";
import { eq } from "drizzle-orm";
import { profileZodSchema } from "#shared/zod/profile.schema";

export default eventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const { name, username, bio } = await readValidatedBody(
    event,
    profileZodSchema.parse,
  );

  // Validar username único
  const [existingUser] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.username, username));

  if (existingUser && existingUser.id !== user.id) {
    throw createError({
      statusCode: 409,
      statusMessage: "Username already exists",
    });
  }

  // Actualizar el perfil del usuario
  await db
    .update(usersTable)
    .set({
      name,
      username,
      bio,
    })
    .where(eq(usersTable.id, user.id));

  return {
    message: "Profile updated successfully",
  };
});
