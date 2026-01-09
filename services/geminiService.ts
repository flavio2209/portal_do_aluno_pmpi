
import { GoogleGenAI } from "@google/genai";

export const getEducationalAdvice = async (studentName: string, subjects: any[]) => {
  // A API Key deve ser obtida exclusivamente de process.env.API_KEY
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    console.warn("EduConnect: Gemini API Key não configurada. Usando fallback motivacional.");
    return "Mantenha o foco nos estudos para garantir as melhores notas e um futuro brilhante!";
  }

  // Inicializa o cliente seguindo a convenção obrigatória: new GoogleGenAI({ apiKey })
  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    Como assistente virtual da escola, analise as notas do aluno ${studentName}.
    Disciplinas e notas: ${JSON.stringify(subjects)}.
    Dê um conselho curto, humano e motivador para o aluno ou seus pais sobre o desempenho acadêmico.
    Destaque um ponto positivo e uma área de atenção de forma acolhedora.
    Responda em Português do Brasil.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    
    // Acessa a propriedade .text diretamente do objeto de resposta
    return response.text || "Continue evoluindo sempre!";
  } catch (error) {
    console.error("EduConnect AI Error:", error);
    return "Seu desempenho mostra grande potencial. Continue se dedicando para alcançar seus objetivos!";
  }
};
