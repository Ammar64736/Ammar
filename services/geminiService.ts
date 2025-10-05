
import { GoogleGenAI, Modality } from '@google/genai';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const generateCinematicAngle = async (
  base64ImageData: string,
  mimeType: string,
  cameraAngleDescription: string
): Promise<string | null> => {
  try {
    const model = 'gemini-2.5-flash-image-preview';

    const prompt = `Recreate this exact scene from the perspective of ${cameraAngleDescription}. The subject, lighting, location, mood, clothing, and all other details must remain identical. Only change the camera perspective. Do not add any text or watermarks.`;

    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [
          {
            inlineData: {
              data: base64ImageData,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    const parts = response?.candidates?.[0]?.content?.parts;
    if (parts) {
      for (const part of parts) {
        if (part.inlineData) {
          return part.inlineData.data;
        }
      }
    }
    
    console.warn("No image part found in the response for angle:", cameraAngleDescription);
    return null;

  } catch (error) {
    console.error(`Error generating image for angle "${cameraAngleDescription}":`, error);
    throw error;
  }
};
