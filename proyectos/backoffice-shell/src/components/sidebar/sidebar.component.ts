import { Component, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <aside class="bg-slate-900 text-white w-64 h-full flex flex-col flex-shrink-0 transition-all duration-300">
      <div class="p-6 border-b border-slate-800 flex items-center gap-3">
        <div class="w-8 h-8 rounded bg-blue-500 flex items-center justify-center font-bold text-lg">B</div>
        <span class="font-bold text-xl tracking-tight">Backoffice</span>
      </div>

      <nav class="flex-1 overflow-y-auto py-6 px-3 space-y-1">
        <a routerLink="/" 
           routerLinkActive="bg-blue-600 text-white shadow-lg shadow-blue-900/50" 
           class="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-all group">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span class="font-medium">home</span>
        </a>

        <a routerLink="/onboarding" 
           routerLinkActive="bg-blue-600 text-white shadow-lg shadow-blue-900/50" 
           class="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-all group">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <span class="font-medium">Onboarding</span>
          <span class="ml-auto bg-blue-500 text-xs px-2 py-0.5 rounded-full text-white font-bold">MF</span>
        </a>
      </nav>

      <div class="p-4 border-t border-slate-800">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div class="flex flex-col">
            <span class="text-sm font-medium text-white">Admin User</span>
            <span class="text-xs text-slate-400">admin@company.com</span>
          </div>
        </div>
      </div>
    </aside>
  `
})
export class SidebarComponent {}
