
export function generateOTP(): string {
  const min = 100000;
  const max = 999999;
  let randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

  // handle not start with zero
  while (randomNumber.toString().startsWith('0')) {
    randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
  };

  return randomNumber.toString();
};