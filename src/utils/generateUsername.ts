export const generateUsername = (givenName: string): string => {
  // Convert the given name to lowercase
  givenName = givenName.toLowerCase();

  // Replace any spaces with underscores
  givenName = givenName.replace(" ", "_");

  // Generate a random string of characters
  const randomChars = Math.random().toString(36).substring(2, 10);

  // Combine the name, random characters, and a random number to create the username
  let username = `${givenName}_${randomChars}_${Math.floor(
    Math.random() * 100
  )}`;

  // Trim the username to 30 characters
  username = username.substring(0, 30);

  return username;
};
