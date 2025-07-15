export const uploadImage = async (imageUrl: string): Promise<string | null> => {
  const formData = new FormData();

  // If the image is from file upload
  if (imageUrl.startsWith('blob:')) {
    const blob = await fetch(imageUrl).then(response => response.blob()); // Turning the image data into a blob
    const file = new File([blob], 'tempFileName', { type: blob.type }); // Creates a new file object in the browser using data from blob

    formData.append('file', file);
  }
  // If the image is from a URL
  else {
    // First check if the image is valid
    const isValid = await checkImageExists(imageUrl);
    
    if (!isValid) {
      alert("Please provide a valid image URL");
      return null;
    }

    formData.append('url', imageUrl);
  }

  const response = await fetch('/api/database/photos', {
    method: 'POST',
    body: formData
  });

  const data = await response.json();

  if (!response.ok) {
    console.error(`${response.status} - ${JSON.stringify(data)}`);
    return null;
  }

  return data.fileName;
}

const checkImageExists = (url: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
}