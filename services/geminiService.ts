import { GoogleGenAI, Type } from "@google/genai";
import { Tone } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const generateTweets = async (topic: string, tone: Tone): Promise<string[]> => {
  try {
    const prompt = `Genera 5 tuits cortos y atractivos para la red social X sobre el siguiente tema: "${topic}".
    El tono de los tuits debe ser ${tone}.
    Cada tuit debe ser conciso, idealmente de menos de 280 caracteres.
    Incluye 2 o 3 hashtags relevantes en cada tuit.
    Responde únicamente con un array JSON que contenga 5 strings, donde cada string es un tuit. No incluyas texto adicional ni explicaciones fuera del JSON.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING,
            description: "Un tuit generado para la red social X.",
          },
        },
        temperature: 0.8,
        topP: 0.95,
      },
    });

    const jsonString = response.text.trim();
    const tweets = JSON.parse(jsonString);

    if (Array.isArray(tweets) && tweets.every(t => typeof t === 'string')) {
      return tweets;
    } else {
      console.error("La respuesta de la API no es un array de strings:", tweets);
      throw new Error("La respuesta de la API no tuvo el formato esperado.");
    }

  } catch (error) {
    console.error("Error al generar tuits:", error);
    throw new Error("No se pudieron generar los tuits. Por favor, intenta de nuevo.");
  }
};