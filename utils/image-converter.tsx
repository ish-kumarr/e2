export async function convertWebpToJpg(url: string): Promise<string> {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error('Error converting webp to jpg:', error);
      return url; // Return original URL as fallback
    }
  }