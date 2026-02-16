import { db } from "~~/server/database";
import { usersTable } from "~~/server/database/schema";
import { eq } from "drizzle-orm";

export default eventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  // Buscar el usuario en la base de datos
  const [userProfile] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, user.id));

  if (!userProfile) {
    throw createError({
      statusCode: 404,
      statusMessage: "User not found",
    });
  }

  return {
    id: userProfile.id,
    email: userProfile.email,
    name: userProfile.name,
    username: userProfile.username,
    bio: userProfile.bio,
    avatarUrl: userProfile.avatarUrl,
  };
});
