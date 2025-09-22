import { db } from './database';

export default async function checkRate(userId: string, feature: 'search' | 'map') {
  const limit = feature === 'search' ? 100 : 250;
  const rateArr = await db.getRate(userId, feature);

  const window = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  const now = new Date();
  const windowStart = new Date(now.getTime() - window); // Timestamp for the start of the window

  // Drop all timestamps older than the window
  const validTimestamps = rateArr.filter(timestamp => timestamp > windowStart);

  // Check if the number of valid timestamps exceed the limit
  if (validTimestamps.length >= limit) {
    return false;
  }

  // Add the current timestamp to the array
  await db.addTimestamp(userId, feature, now);

  return true;
}