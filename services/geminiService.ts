
import { GoogleGenAI } from "@google/genai";

export const getEducationalAdvice = async (studentName: string, subjects: any[]) => {
  // Inicialização segura para ambiente de navegador
  let apiKey = '';
  try {
    apiKey = (typeof process !== 'undefined' && process.env?.API_KEY) ? process.env.API_KEY : '';
  } catch (e) {
    console.warn("API Key não encontrada.");
  }
  
  if (!apiKey) {
    return "Mantenha o foco nos estudos para garantir as melhores notas!";
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    Como assistente virtual da escola, analise as notas do aluno ${studentName}.
    Disciplinas e notas: ${JSON.stringify(subjects)}.
    Dê um conselho curto e motivador para o aluno ou seus pais sobre o desempenho acadêmico, destacando onde ele está indo bem e onde pode melhorar.
    Responda em Português do Brasil de forma acolhedora.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    
    return response.text || "Continue evoluindo sempre!";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Continue se dedicando às matérias do semestre. Sua persistência levará ao sucesso acadêmico!";
  }
};
