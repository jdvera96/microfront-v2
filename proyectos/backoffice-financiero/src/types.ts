export interface Transaction {
  id: string;
  date: string;
  amount: number;
  currency: string;
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
  reference: string;
}

export interface Discrepancy {
  type: 'MISSING_IN_PSP' | 'MISSING_IN_CUSTOMER' | 'AMOUNT_MISMATCH' | 'STATUS_MISMATCH';
  transactionId: string;
  description: string;
  differenceAmount?: number;
}

export interface ReconciliationReport {
  id: string;
  date: string;
  pspName: string; // e.g., Stripe, PayPal, Adyen
  customerFileId: string;
  totalTransactionsPsp: number;
  totalTransactionsCustomer: number;
  totalAmountPsp: number;
  totalAmountCustomer: number;
  status: 'MATCHED' | 'DISCREPANCY' | 'PENDING';
  discrepancies: Discrepancy[];
  aiAnalysis?: string; // Field to store Gemini's analysis
  isAnalyzing?: boolean;
}