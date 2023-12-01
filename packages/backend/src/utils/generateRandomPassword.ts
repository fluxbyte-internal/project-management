import crypto from "crypto";

export function generateRandomPassword(length = 8): string {
  const specialChars = "!@#$%^&*(),.?<>";
  const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
  const numericChars = "0123456789";
  const charsArray = [
    uppercaseChars,
    numericChars,
    lowercaseChars,
    specialChars,
  ];
  charsArray.sort(() => Math.random() - 0.5);
  let password = "";
  for (let i = 0; i < length; i++) {
    const charTypeIndex = i % charsArray.length;
    const chosenChars = charsArray[charTypeIndex]!;
    const randomIndex = crypto.randomInt(0, chosenChars.length);
    password += chosenChars[randomIndex];
  }
  return password;
};
