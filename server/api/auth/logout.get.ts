export default eventHandler(async (event) => {
  await clearUserSession(event);

  return {
    message: "You have been logged out.",
  };
});
