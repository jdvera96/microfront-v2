import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Customer } from '../../types';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-customer-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customer-table.component.html'
})
export class CustomerTableComponent implements OnInit {
  private customerService = inject(CustomerService);

  customers = signal<Customer[]>([]);
  loading = signal<boolean>(true);
  searchQuery = signal<string>('');

  // Derived state for filtering
  filteredCustomers = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const allCustomers = this.customers();
    
    if (!query) return allCustomers;

    return allCustomers.filter(customer => 
      customer.name.toLowerCase().includes(query) ||
      customer.email.toLowerCase().includes(query) ||
      customer.company.toLowerCase().includes(query) ||
      customer.role.toLowerCase().includes(query)
    );
  });

  ngOnInit() {
    this.refreshData();
  }

  async refreshData() {
    this.loading.set(true);
    try {
      const data = await this.customerService.getCustomers();
      this.customers.set(data);
    } catch (err) {
      console.error(err);
    } finally {
      this.loading.set(false);
    }
  }

  updateSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(value);
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
    } catch (e) {
      return dateString;
    }
  }
}