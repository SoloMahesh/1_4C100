import { GoogleGenAI, Type } from "@google/genai";
import { ComparisonResult } from "../types";
import { SUPPORTED_PLATFORMS } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const cleanJsonString = (str: string): string => {
  let cleaned = str.trim();
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.substring(7);
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.substring(3);
  }
  if (cleaned.endsWith("```")) {
    cleaned = cleaned.substring(0, cleaned.length - 3);
  }
  return cleaned;
};

export const fetchComparisonData = async (
  amount: number,
  fromCurrency: string,
  toCurrency: string
): Promise<ComparisonResult> => {
  
  const model = "gemini-2.5-flash";
  
  // Dynamically list our supported platforms to guide the AI
  const supportedNames = SUPPORTED_PLATFORMS.map(p => p.name).join(", ");

  // We want to force a structured JSON response, but we also want Grounding to work.
  const prompt = `
    You are a financial expert and currency exchange aggregator.
    The user wants to send ${amount} ${fromCurrency} to ${toCurrency}.
    
    Task:
    1. Search for the current mid-market exchange rate for ${fromCurrency} to ${toCurrency}.
    2. Analyze and Compare the following specific money transfer platforms for this corridor: ${supportedNames}.
    3. If a platform listed above is NOT available for ${fromCurrency} to ${toCurrency}, do not include it in the JSON.
    4. Identify which platform offers the best value, fastest delivery, and if there are any active referral bonuses.
    
    Output Requirement:
    Return ONLY a valid JSON object representing the data. Do not include markdown formatting around the JSON.
    
    JSON Structure:
    {
      "marketRate": number,
      "timestamp": "YYYY-MM-DD HH:MM string",
      "analysis": "A brief 2-sentence analysis of the market and recommendation.",
      "platforms": [
        {
          "name": "Platform Name",
          "rate": number (the exchange rate they offer),
          "transferFee": number (estimated fee in source currency),
          "totalReceiveAmount": number (how much recipient gets),
          "currency": "${toCurrency}",
          "estimatedDelivery": "e.g., 'In minutes' or '2 days'",
          "pros": ["Low fee", "Fast"],
          "referralBonus": "Any text about sign-up bonus or 'None'",
          "isBestValue": boolean,
          "isFastest": boolean
        }
      ]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.1, // Low temperature for factual consistency
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const urls = groundingChunks
      .map((chunk) => chunk.web?.uri)
      .filter((uri): uri is string => !!uri);

    const uniqueUrls = Array.from(new Set(urls));

    try {
      const jsonStr = cleanJsonString(text);
      const data = JSON.parse(jsonStr);
      
      // Attach grounding URLs to the result for transparency
      return {
        ...data,
        groundingUrls: uniqueUrls
      };
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError, "Raw Text:", text);
      // Fallback structure if JSON fails but we have text (unlikely with 2.5-flash instructions)
      throw new Error("Failed to parse comparison data. Please try again.");
    }

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};