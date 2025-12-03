import { GoogleGenAI } from "@google/genai";
import { Task } from "../types";

// Helper to clean output
const cleanText = (text: string | undefined) => text?.trim() || "No insight available.";

export const generateDailyInsight = async (tasks: Task[], dateStr: string): Promise<string> => {
  if (!process.env.API_KEY) {
    return "API Key is missing. Please configure your environment.";
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const completed = tasks.filter(t => t.completed);
  const incomplete = tasks.filter(t => !t.completed);
  
  const completionRate = tasks.length > 0 ? Math.round((completed.length / tasks.length) * 100) : 0;

  const prompt = `
    Analyze the productivity for the date: ${dateStr}.
    
    Here is the data:
    - Total Tasks: ${tasks.length}
    - Completed: ${completed.length}
    - Incomplete: ${incomplete.length}
    - Completion Rate: ${completionRate}%
    
    Completed Tasks:
    ${completed.map(t => `- [${t.priority}] ${t.text}`).join('\n')}
    
    Incomplete Tasks:
    ${incomplete.map(t => `- [${t.priority}] ${t.text}`).join('\n')}
    
    Please provide a concise, friendly, and constructive reflection (max 80 words). 
    If productivity was high, celebrate it. 
    If low, offer a gentle encouraging tip for improvement.
    Address the user directly as "you".
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "You are a wise and encouraging productivity coach.",
        thinkingConfig: { thinkingBudget: 0 } // Disable thinking for faster simple responses
      }
    });

    return cleanText(response.text);
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Could not generate insight at this time. Please try again later.";
  }
};
