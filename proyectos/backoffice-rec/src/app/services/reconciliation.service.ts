import { Injectable } from '@angular/core';

export type ReconciliationStatus = 'Pendiente' | 'En revisión' | 'Conciliado' | 'Observado';

export interface FinancialFileReport {
  id: string;
  fileName: string;
  source: string;
  period: string; // YYYY-MM
  uploadedAt: string; // ISO string
  amount: number;
  currency: 'PEN' | 'USD';
  status: ReconciliationStatus;
  records: number;
  notes?: string;
}

@Injectable({ providedIn: 'root' })
export class ReconciliationService {
  getFinancialFiles(): FinancialFileReport[] {
    return [
      {
        id: 'REC-0001',
        fileName: 'extracto-bcp-2025-11.csv',
        source: 'BCP',
        period: '2025-11',
        uploadedAt: '2025-12-01T14:12:00.000Z',
        amount: 154320.55,
        currency: 'PEN',
        status: 'En revisión',
        records: 3890,
        notes: 'Diferencias menores por redondeo en 3 registros.',
      },
      {
        id: 'REC-0002',
        fileName: 'extracto-interbank-2025-11.xlsx',
        source: 'Interbank',
        period: '2025-11',
        uploadedAt: '2025-12-01T15:40:00.000Z',
        amount: 80211.12,
        currency: 'PEN',
        status: 'Pendiente',
        records: 2104,
      },
      {
        id: 'REC-0003',
        fileName: 'ventas-visa-2025-11.json',
        source: 'VISA',
        period: '2025-11',
        uploadedAt: '2025-12-02T09:05:00.000Z',
        amount: 43790.0,
        currency: 'USD',
        status: 'Observado',
        records: 988,
        notes: 'Faltan 2 settlement IDs.',
      },
      {
        id: 'REC-0004',
        fileName: 'liquidaciones-mastercard-2025-10.csv',
        source: 'Mastercard',
        period: '2025-10',
        uploadedAt: '2025-11-10T18:21:00.000Z',
        amount: 120440.33,
        currency: 'USD',
        status: 'Conciliado',
        records: 3211,
      },
    ];
  }
}


