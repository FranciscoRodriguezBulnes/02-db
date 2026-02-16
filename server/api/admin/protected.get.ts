export default eventHandler(async (event) => {
  const session = await requireUserSession(event)
  return {
    message: "This is a protected route. You are authenticated!",
    session,
  }
});
