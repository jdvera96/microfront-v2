import { Component } from '@angular/core';
import { ReconciliationService, ReconciliationStatus, FinancialFileReport } from '../../services/reconciliation.service';

@Component({
  selector: 'app-financial-report',
  templateUrl: './financial-report.component.html',
  styleUrl: './financial-report.component.css',
  standalone: false,
})
export class FinancialReportComponent {
  search = '';
  status: ReconciliationStatus | 'Todos' = 'Todos';

  constructor(private rec: ReconciliationService) {}

  get files(): FinancialFileReport[] {
    return this.rec.getFinancialFiles();
  }

  get filtered(): FinancialFileReport[] {
    const q = this.search.trim().toLowerCase();
    return this.files.filter((f) => {
      const matchesQ =
        !q ||
        f.fileName.toLowerCase().includes(q) ||
        f.source.toLowerCase().includes(q) ||
        f.id.toLowerCase().includes(q);
      const matchesStatus = this.status === 'Todos' || f.status === this.status;
      return matchesQ && matchesStatus;
    });
  }

  badgeClass(s: ReconciliationStatus): string {
    switch (s) {
      case 'Conciliado':
        return 'badge ok';
      case 'En revisión':
        return 'badge review';
      case 'Pendiente':
        return 'badge pending';
      case 'Observado':
        return 'badge warn';
    }
  }

  formatMoney(amount: number, currency: 'PEN' | 'USD'): string {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  }
}


