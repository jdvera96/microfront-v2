import { Injectable } from '@angular/core';
import { GoogleGenAI } from '@google/genai';
import { ReconciliationReport } from '../types';

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: '1234567890' });
  }

  async analyzeReport(report: ReconciliationReport): Promise<string> {
    try {
      const model = 'gemini-2.5-flash';
      const prompt = `
        Actúa como un auditor financiero senior experto en conciliaciones bancarias.
        Analiza el siguiente reporte de conciliación JSON y proporciona un resumen ejecutivo breve (máximo 3 párrafos).
        
        Datos del reporte:
        ${JSON.stringify(report, null, 2)}
        
        Instrucciones:
        1. Identifica la gravedad de las discrepancias.
        2. Sugiere una causa raíz probable basándote en el tipo de error (ej. time lag, fees ocultos, error de sistema).
        3. Recomienda una acción inmediata.
        4. Usa formato Markdown limpio.
        5. Sé profesional y directo.
      `;

      const response = await this.ai.models.generateContent({
        model: model,
        contents: prompt,
      });

      return response.text;
    } catch (error) {
      console.error('Error calling Gemini:', error);
      return 'No se pudo generar el análisis en este momento. Por favor verifique su conexión o intente más tarde.';
    }
  }
}