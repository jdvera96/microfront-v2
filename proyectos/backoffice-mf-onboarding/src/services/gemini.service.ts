import { Injectable } from '@angular/core';
import { GoogleGenAI, Type } from '@google/genai';

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    // Initialize Gemini with the environment API key
    this.ai = new GoogleGenAI({ apiKey: process.env['API_KEY'] || '' });
  }

  async generateBusinessData(companyName: string): Promise<any> {
    const model = 'gemini-2.5-flash';
    const prompt = `Genera un perfil de datos de empresa ficticio pero realista para una compañía llamada "${companyName || 'Empresa Genérica'}". 
    El perfil debe ser para una empresa en España.`;

    try {
      const response = await this.ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              cif: { type: Type.STRING, description: 'Código de Identificación Fiscal español (ficticio)' },
              address: { type: Type.STRING, description: 'Dirección completa' },
              sector: { type: Type.STRING, description: 'Sector de actividad económica' },
              employees: { type: Type.INTEGER, description: 'Número aproximado de empleados' }
            }
          }
        }
      });

      if (response.text) {
        return JSON.parse(response.text);
      }
      return null;
    } catch (error) {
      console.error('Error generating business data:', error);
      throw error;
    }
  }
}