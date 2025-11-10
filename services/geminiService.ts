
import { GoogleGenAI, Type } from '@google/genai';
import type { AnalysisResult } from '../types';

const getAiClient = () => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set");
    }
    // Fix: Instantiate GoogleGenAI directly from the import, not from the window object.
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
}

export async function analyzeReviews(reviewsText: string): Promise<Omit<AnalysisResult, 'summary'>> {
  const ai = getAiClient();

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `Analyze the following customer reviews. For each review, determine its sentiment (POSITIVE, NEGATIVE, or NEUTRAL), and extract key terms related to praises and complaints. Assign a chronological identifier to each review (e.g., 'Review 1', 'Review 2'). Provide the output as a JSON object that strictly adheres to the provided schema.

Reviews:
${reviewsText}`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        // Fix: Use Type enum directly from the import.
        type: Type.OBJECT,
        properties: {
          trendData: {
            // Fix: Use Type enum directly from the import.
            type: Type.ARRAY,
            description: "An array of sentiment data points, one for each review.",
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING, description: "Chronological identifier for the review (e.g., 'Review 1')." },
                sentiment: { type: Type.NUMBER, description: "Sentiment score: 1 for POSITIVE, 0 for NEUTRAL, -1 for NEGATIVE." }
              }
            }
          },
          praises: {
            // Fix: Use Type enum directly from the import.
            type: Type.ARRAY,
            description: "A list of most frequent positive keywords and their counts.",
            items: {
              type: Type.OBJECT,
              properties: {
                text: { type: Type.STRING, description: "The positive keyword." },
                value: { type: Type.NUMBER, description: "The frequency of the keyword." }
              }
            }
          },
          complaints: {
            // Fix: Use Type enum directly from the import.
            type: Type.ARRAY,
            description: "A list of most frequent negative keywords and their counts.",
            items: {
              type: Type.OBJECT,
              properties: {
                text: { type: Type.STRING, description: "The negative keyword." },
                value: { type: Type.NUMBER, description: "The frequency of the keyword." }
              }
            }
          }
        }
      }
    }
  });

  try {
    const jsonText = response.text.trim();
    const parsed = JSON.parse(jsonText);
    // Basic validation
    if (!parsed.trendData || !parsed.praises || !parsed.complaints) {
        throw new Error("Invalid data structure received from AI.");
    }
    return parsed;
  } catch(e) {
    console.error("Failed to parse AI response:", response.text);
    throw new Error("Could not parse the analysis data from the AI. The model may have returned an unexpected format.");
  }
}

export async function generateExecutiveSummary(reviewsText: string): Promise<string> {
  const ai = getAiClient();
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-pro',
    contents: `Based on the following collection of customer reviews, conduct a deep analysis to identify the most critical patterns and themes. Synthesize your findings into a concise executive summary. The summary must pinpoint the top 3 actionable areas for improvement for the business. Be specific and provide clear recommendations. Format your response in markdown.

Reviews:
${reviewsText}`,
    config: {
        thinkingConfig: { thinkingBudget: 32768 },
    }
  });

  return response.text;
}
