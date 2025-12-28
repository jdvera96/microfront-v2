import { Component } from '@angular/core';
import { CustomerTableComponent } from './components/customer-table/customer-table.component';

@Component({
  selector: 'app-kbrm-customer-dashboard-mfe',
  standalone: true,
  imports: [CustomerTableComponent],
  templateUrl: './app.component.html'
})
export class AppComponent {
  // Logic here if needed for global state, but mostly visual composition in template
}