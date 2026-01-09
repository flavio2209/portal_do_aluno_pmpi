
import { GoogleGenAI } from "@google/genai";

// Inicialização estrita conforme as diretrizes do desenvolvedor
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getEducationalAdvice = async (studentName: string, subjects: any[]) => {
  const prompt = `
    Como assistente virtual da escola, analise as notas do aluno ${studentName}.
    Disciplinas e notas: ${JSON.stringify(subjects)}.
    Dê um conselho curto e motivador para o aluno ou seus pais sobre o desempenho acadêmico, destacando onde ele está indo bem e onde pode melhorar.
    Responda em Português do Brasil.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    
    // O uso de .text é uma propriedade, não um método
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Não foi possível gerar uma análise personalizada no momento. Continue focado nos estudos e mantenha a consistência!";
  }
};
