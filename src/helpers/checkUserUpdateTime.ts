import httpStatus from 'http-status';
import ApiError from '../errors/ApiError';

function checkUserUpdateTime(updatedAt: Date): [boolean, string] {
  const updatedAtTimestamp = updatedAt.getTime();
  const nowTimestamp = Date.now();
  const differenceMs = nowTimestamp - updatedAtTimestamp;
  const daysLeft = Math.floor(differenceMs / (1000 * 60 * 60 * 24));
  const updateThresholdDays = 7;

  if (daysLeft >= updateThresholdDays) {
    return [true, daysLeft.toString() + ' days'];
  } else {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `you can update you name after ${
        (updateThresholdDays - daysLeft).toString() + ' days'
      }`
    );
  }
}
export default checkUserUpdateTime;
