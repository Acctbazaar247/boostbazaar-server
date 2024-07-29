import otpGenerator from 'otp-generator';
// export default function generateOTP(): number {
//   const otp = Math.floor(1000 + Math.random() * 9000);
//   return otp;
// }
export function checkTimeOfOTP(createdAt: Date) {
  const thirtyMinutesInMilliseconds = 30 * 60 * 1000; // 30 minutes in milliseconds
  const currentTime = new Date();
  const createdAtTime = new Date(createdAt);
  const difference = currentTime.getTime() - createdAtTime.getTime();

  return difference >= thirtyMinutesInMilliseconds;
}

// eslint-disable-next-line no-unused-vars
export const generateOtp: (len?: number) => number = len => {
  const otp = otpGenerator.generate(len || 6, {
    upperCaseAlphabets: false,
    specialChars: false,
    digits: true,
    lowerCaseAlphabets: false,
  });
  return parseInt(otp);
};
