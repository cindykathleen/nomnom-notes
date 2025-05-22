export const getPhoto = async (photoId: string): Promise<string> => {
  // Make sure apiKey is not undefined
  const apiKey = process.env.API_SECRET_KEY!;
  const endpoint = `https://places.googleapis.com/v1/${photoId}/media?maxHeightPx=1600&skipHttpRedirect=true`;

  const response = await fetch(endpoint, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey
    }
  });

  if(!response.ok) {
    throw new Error(`HTTP ${response.status} - ${response.statusText}`);
  }

  const data = await response.json();
  return data.photoUri;
}