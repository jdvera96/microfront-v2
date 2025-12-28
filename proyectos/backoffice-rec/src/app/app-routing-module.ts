import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FinancialReportComponent } from './pages/financial-report/financial-report.component';

const routes: Routes = [
  { path: '', redirectTo: 'report', pathMatch: 'full' },
  { path: 'report', component: FinancialReportComponent },
  { path: '**', redirectTo: 'report' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
