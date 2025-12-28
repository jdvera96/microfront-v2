import { Injectable } from '@angular/core';
import { GoogleGenAI, Type } from '@google/genai/web';
import { Customer } from '../types';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  
  async getCustomers(): Promise<Customer[]> {
    try {
      const apiKey = process.env['API_KEY'];
      if (!apiKey) {
        console.warn('API Key not found, returning fallback data.');
        return this.getFallbackData();
      }

      const ai = new GoogleGenAI({ apiKey });
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: 'Generate 12 realistic, diverse customer profiles for a CRM dashboard. Ensure variety in status and roles.',
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                name: { type: Type.STRING },
                email: { type: Type.STRING },
                role: { type: Type.STRING, enum: ['Admin', 'User', 'Editor', 'Viewer'] },
                status: { type: Type.STRING, enum: ['Active', 'Inactive', 'Pending'] },
                company: { type: Type.STRING },
                lastActive: { type: Type.STRING, description: 'ISO date string representing last login' },
                revenue: { type: Type.NUMBER, description: 'Total lifetime value of customer' }
              },
              required: ['id', 'name', 'email', 'role', 'status', 'company', 'lastActive', 'revenue']
            }
          }
        }
      });

      const data = JSON.parse(response.text);
      
      // Add avatars locally since the AI can't generate real image URLs reliably
      return data.map((c: any) => ({
        ...c,
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${c.id}`
      }));

    } catch (error) {
      console.error('Error fetching data from Gemini:', error);
      return this.getFallbackData();
    }
  }

  private getFallbackData(): Customer[] {
    // Fallback data if API key is missing or error occurs
    const mockData: Customer[] = [
      { id: '1', name: 'Alice Johnson', email: 'alice@techcorp.com', role: 'Admin', status: 'Active', company: 'TechCorp', lastActive: '2023-10-25', revenue: 12000, avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1' },
      { id: '2', name: 'Bob Smith', email: 'bob@marketing.io', role: 'Editor', status: 'Inactive', company: 'Marketing.io', lastActive: '2023-09-15', revenue: 5000, avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2' },
      { id: '3', name: 'Charlie Davis', email: 'charlie@devs.net', role: 'User', status: 'Pending', company: 'DevsNet', lastActive: '2023-10-26', revenue: 0, avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3' },
      { id: '4', name: 'Diana Prince', email: 'diana@hero.org', role: 'Admin', status: 'Active', company: 'Justice League', lastActive: '2023-10-27', revenue: 99999, avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4' },
      { id: '5', name: 'Evan Wright', email: 'evan@writes.com', role: 'Viewer', status: 'Active', company: 'WriteRight', lastActive: '2023-10-20', revenue: 150, avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=5' },
    ];
    return mockData;
  }
}