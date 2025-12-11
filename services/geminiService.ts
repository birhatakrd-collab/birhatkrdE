import { GoogleGenAI, Type } from "@google/genai";
import { RefactorRequest, RefactorResult } from '../types';

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found in environment variables");
  }
  return new GoogleGenAI({ apiKey });
};

export const refactorCode = async (request: RefactorRequest): Promise<RefactorResult> => {
  const ai = getClient();
  
  const prompt = `
    I have a piece of code written in ${request.language}.
    Please refactor this code with a primary focus on: ${request.focus}.
    
    The code is:
    \`\`\`
    ${request.code}
    \`\`\`
    
    If the code contains comments in a specific language (like Kurdish, Arabic, Spanish), try to respect that context but provide the explanation in English unless the code clearly indicates otherwise.
    
    Return a valid JSON object containing:
    1. improvedCode: The complete refactored code string.
    2. explanation: A concise summary of why these changes were made and how they improve the code.
    3. keyChanges: An array of strings listing specific changes (e.g., "Replaced var with const/let", "Removed nested loops").
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          improvedCode: { type: Type.STRING },
          explanation: { type: Type.STRING },
          keyChanges: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ['improvedCode', 'explanation', 'keyChanges']
      }
    }
  });

  const resultText = response.text;
  if (!resultText) {
    throw new Error("No response received from AI");
  }

  try {
    return JSON.parse(resultText) as RefactorResult;
  } catch (error) {
    console.error("Failed to parse JSON response:", resultText);
    throw new Error("Failed to parse AI response");
  }
};