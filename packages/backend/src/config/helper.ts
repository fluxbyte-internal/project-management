export const generateRandomPassword = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*(),.?":{}|<>';

  const randomChar:
    () => string | undefined =
    () => chars[Math.floor(Math.random() * chars.length)];

  const password = Array.from(
    {
      length: 8
    }, (_, i) => i === 0
      ? randomChar() ?? ''
      : i === 1
        ? randomChar() ?? ''
        : i === 2
          ? randomChar() ?? ''
          : randomChar()).join('');

  return password;
};