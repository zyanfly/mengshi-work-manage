import { GoogleGenAI, Type } from "@google/genai";
import { AreaType, Work } from "../types";

const apiKey = process.env.API_KEY || ''; // In a real app, handle missing key gracefully
const ai = new GoogleGenAI({ apiKey });

export const suggestWorksForArea = async (area: AreaType): Promise<Omit<Work, 'id'>[]> => {
  if (!apiKey) {
    console.warn("No API Key found");
    return [];
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Provide a list of 5 classic Montessori works (activities) specifically for the area: "${area}". 
      Return the result in JSON format strictly conforming to the schema. The titles should be in Chinese.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "Name of the work in Chinese" },
              description: { type: Type.STRING, description: "Brief educational purpose" },
            },
            required: ["title", "description"],
          },
        },
      },
    });

    const text = response.text;
    if (!text) return [];

    const rawData = JSON.parse(text);
    
    // Map to our internal structure
    return rawData.map((item: any) => ({
      area: area,
      title: item.title,
      description: item.description
    }));

  } catch (error) {
    console.error("Error fetching suggestions from Gemini:", error);
    return [];
  }
};
