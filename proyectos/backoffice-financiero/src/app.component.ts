import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { CommonModule, DecimalPipe, CurrencyPipe, DatePipe } from '@angular/common';
import { DataService } from './services/data.service';
import { AiService } from './services/ai.service';
import { ReconciliationReport } from './types';

@Component({
  selector: 'app-financiero-mfe',
  standalone: true,
  imports: [CommonModule, DecimalPipe, CurrencyPipe, DatePipe],
  templateUrl: './app.component.html',
  styles: []
})
export class AppComponent implements OnInit {
  private dataService = inject(DataService);
  private aiService = inject(AiService);

  // Signals for state management
  reports = signal<ReconciliationReport[]>([]);
  selectedReportId = signal<string | null>(null);
  filterStatus = signal<'ALL' | 'MATCHED' | 'DISCREPANCY'>('ALL');

  // Computed values
  selectedReport = computed(() => 
    this.reports().find(r => r.id === this.selectedReportId()) || null
  );

  filteredReports = computed(() => {
    const status = this.filterStatus();
    if (status === 'ALL') return this.reports();
    return this.reports().filter(r => r.status === status);
  });

  stats = computed(() => {
    const all = this.reports();
    const discrepancyCount = all.filter(r => r.status === 'DISCREPANCY').length;
    const matchedCount = all.filter(r => r.status === 'MATCHED').length;
    const totalVolume = all.reduce((acc, curr) => acc + curr.totalAmountPsp, 0);
    return { discrepancyCount, matchedCount, totalVolume };
  });

  ngOnInit() {
    this.reports.set(this.dataService.getReports());
  }

  selectReport(id: string) {
    this.selectedReportId.set(id);
  }

  closeDetail() {
    this.selectedReportId.set(null);
  }

  setFilter(status: 'ALL' | 'MATCHED' | 'DISCREPANCY') {
    this.filterStatus.set(status);
  }

  async analyzeWithAi(report: ReconciliationReport) {
    if (report.isAnalyzing || report.aiAnalysis) return;

    // Update local state to show loading
    this.reports.update(reports => 
      reports.map(r => r.id === report.id ? { ...r, isAnalyzing: true } : r)
    );

    const analysis = await this.aiService.analyzeReport(report);

    // Update state with result
    this.reports.update(reports => 
      reports.map(r => r.id === report.id ? { ...r, isAnalyzing: false, aiAnalysis: analysis } : r)
    );
  }

  // Helpers for template styling
  getStatusColor(status: string): string {
    switch (status) {
      case 'MATCHED': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'DISCREPANCY': return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'PENDING': return 'bg-amber-100 text-amber-800 border-amber-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  formatMarkdown(text: string): string {
    // Basic markdown to HTML parser for the AI response
    // Safe because we trust Gemini's output structure generally, but in prod use a sanitizer
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');
  }
}