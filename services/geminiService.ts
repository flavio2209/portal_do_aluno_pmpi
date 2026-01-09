
import { GoogleGenAI } from "@google/genai";

// Verificação segura para evitar que o ReferenceError: process is not defined 
// mate a execução de todo o script no navegador sem bundler.
const getApiKey = () => {
  try {
    return (typeof process !== 'undefined' && process.env) ? process.env.API_KEY : '';
  } catch (e) {
    return '';
  }
};

const apiKey = getApiKey();

// Função que inicializa o cliente apenas quando necessário ou se houver chave
const getAIClient = () => {
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

export const getEducationalAdvice = async (studentName: string, subjects: any[]) => {
  const ai = getAIClient();
  
  if (!ai) {
    return "Conselho automático: Continue focado nos seus estudos e revise as matérias com menores notas!";
  }

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
    
    return response.text || "Continue evoluindo!";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Não foi possível gerar uma análise personalizada no momento. Continue focado nos estudos e mantenha a consistência!";
  }
};
