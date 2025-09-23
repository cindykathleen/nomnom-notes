import { db } from './database';

export default async function checkRate(userId: string, feature: 'search' | 'map') {
  const rateArr = await db.getRate(userId, feature);
  const limit = feature === 'search' 
    ? parseInt(process.env.SEARCH_LIMIT || '100') 
    : parseInt(process.env.MAP_LIMIT || '250');
  

  const window = parseInt(process.env.WINDOW_MS || '86400000'); // 24 hours in milliseconds
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