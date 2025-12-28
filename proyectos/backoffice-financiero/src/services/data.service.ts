import { Injectable } from '@angular/core';
import { ReconciliationReport, Discrepancy } from '../types';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  
  getReports(): ReconciliationReport[] {
    return [
      {
        id: 'REP-2023-10-01',
        date: '2023-10-25',
        pspName: 'Stripe',
        customerFileId: 'CUST-DB-001',
        totalTransactionsPsp: 1500,
        totalTransactionsCustomer: 1500,
        totalAmountPsp: 45000.00,
        totalAmountCustomer: 45000.00,
        status: 'MATCHED',
        discrepancies: []
      },
      {
        id: 'REP-2023-10-02',
        date: '2023-10-26',
        pspName: 'PayPal',
        customerFileId: 'CUST-DB-002',
        totalTransactionsPsp: 850,
        totalTransactionsCustomer: 852,
        totalAmountPsp: 21500.50,
        totalAmountCustomer: 21650.00,
        status: 'DISCREPANCY',
        discrepancies: [
          {
            type: 'MISSING_IN_PSP',
            transactionId: 'TXN-99881',
            description: 'Transacción registrada en cliente pero no en PSP.',
            differenceAmount: 100.00
          },
          {
            type: 'AMOUNT_MISMATCH',
            transactionId: 'TXN-99882',
            description: 'Diferencia en comisión aplicada.',
            differenceAmount: 49.50
          }
        ]
      },
      {
        id: 'REP-2023-10-03',
        date: '2023-10-27',
        pspName: 'Adyen',
        customerFileId: 'CUST-DB-003',
        totalTransactionsPsp: 3200,
        totalTransactionsCustomer: 3190,
        totalAmountPsp: 125000.00,
        totalAmountCustomer: 124100.00,
        status: 'DISCREPANCY',
        discrepancies: [
          {
            type: 'MISSING_IN_CUSTOMER',
            transactionId: 'ADY-7721',
            description: 'Cobro exitoso en PSP no reflejado en DB cliente.',
            differenceAmount: 900.00
          }
        ]
      },
      {
        id: 'REP-2023-10-04',
        date: '2023-10-27',
        pspName: 'MercadoPago',
        customerFileId: 'CUST-DB-004',
        totalTransactionsPsp: 450,
        totalTransactionsCustomer: 450,
        totalAmountPsp: 12000.00,
        totalAmountCustomer: 12000.00,
        status: 'PENDING',
        discrepancies: []
      },
      {
        id: 'REP-2023-10-05',
        date: '2023-10-28',
        pspName: 'Stripe',
        customerFileId: 'CUST-DB-005',
        totalTransactionsPsp: 142,
        totalTransactionsCustomer: 145,
        totalAmountPsp: 4200.00,
        totalAmountCustomer: 4550.00,
        status: 'DISCREPANCY',
        discrepancies: [
            {
                type: 'MISSING_IN_PSP',
                transactionId: 'STR-5511',
                description: 'Transacción pendiente de liquidación.',
                differenceAmount: 350.00
            }
        ]
      }
    ];
  }
}