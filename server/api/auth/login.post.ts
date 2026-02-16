// import { z } from "zod";
import { usersTable } from "~~/server/database/schema";
import { db } from "~~/server/database";
import { eq } from "drizzle-orm";
import { loginZodSchema } from "#shared/zod/login.schema";

export default eventHandler(async (event) => {
  const { email, password } = await readValidatedBody(event, loginZodSchema.parse);

  // Buscar el usuario por email
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email));

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Invalid --email or password",
    });
  }

  // Verificar la contraseña
  const isPasswordValid = await verifyPassword(user.password, password);

  if (!isPasswordValid) {
    throw createError({
      statusCode: 401,
      statusMessage: "Invalid email or --password",
    });
  }

  // Crear la sesión del usuario

  await setUserSession(event, {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
  });

  return {
    message: "Login successful",
  };
});
