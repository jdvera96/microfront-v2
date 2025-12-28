import { Component, ElementRef, OnInit, ViewChild, inject, signal, afterNextRender } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    <div class="p-8 h-full overflow-y-auto">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-800">Welcome back, Admin</h1>
        <p class="text-gray-500 mt-2">Here is your daily activity overview.</p>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-gray-500 text-sm font-medium">Total Users</h3>
            <span class="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </span>
          </div>
          <div class="text-3xl font-bold text-gray-800">12,543</div>
          <p class="text-green-500 text-sm mt-2 flex items-center">
            <span class="mr-1">↑</span> 12.5% vs last month
          </p>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-gray-500 text-sm font-medium">Active Sessions</h3>
            <span class="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </span>
          </div>
          <div class="text-3xl font-bold text-gray-800">842</div>
          <p class="text-green-500 text-sm mt-2 flex items-center">
            <span class="mr-1">↑</span> 5.2% vs last hour
          </p>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-gray-500 text-sm font-medium">Pending Onboarding</h3>
            <span class="p-2 bg-orange-50 text-orange-600 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </span>
          </div>
          <div class="text-3xl font-bold text-gray-800">45</div>
          <p class="text-orange-500 text-sm mt-2 font-medium">
            Requires attention
          </p>
        </div>
      </div>

      <!-- Charts Area -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 class="text-lg font-bold text-gray-800 mb-6">User Acquisition Trend</h3>
          <div #chartContainer class="w-full h-64"></div>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 class="text-lg font-bold text-gray-800 mb-4">Recent Activity</h3>
          <div class="space-y-4">
            @for (item of activities; track item.id) {
              <div class="flex items-start gap-3 pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                <div [class]="'w-2 h-2 mt-2 rounded-full ' + item.color"></div>
                <div>
                  <p class="text-sm font-medium text-gray-800">{{ item.text }}</p>
                  <p class="text-xs text-gray-400">{{ item.time }}</p>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `
})
export class HomeComponent implements OnInit {
  @ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef;

  activities = [
    { id: 1, text: 'New user registration completed', time: '2 minutes ago', color: 'bg-green-500' },
    { id: 2, text: 'System backup successful', time: '1 hour ago', color: 'bg-blue-500' },
    { id: 3, text: 'Onboarding module updated', time: '3 hours ago', color: 'bg-purple-500' },
    { id: 4, text: 'Alert: High latency detected', time: '5 hours ago', color: 'bg-red-500' },
  ];

  constructor() {
    afterNextRender(() => {
        this.createChart();
    });
  }

  ngOnInit() {
    // Basic init
  }

  createChart() {
    const element = this.chartContainer.nativeElement;
    // Clear previous
    d3.select(element).selectAll('*').remove();

    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = element.offsetWidth - margin.left - margin.right;
    const height = element.offsetHeight - margin.top - margin.bottom;

    const svg = d3.select(element)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Mock data
    const data = Array.from({ length: 10 }, (_, i) => ({
      x: i,
      y: Math.floor(Math.random() * 50) + 20
    }));

    const x = d3.scaleLinear()
      .domain([0, 9])
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain([0, 100])
      .range([height, 0]);

    // Add X axis
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(5));

    // Add Y axis
    svg.append('g')
      .call(d3.axisLeft(y).ticks(5));

    // Add Line
    const line = d3.line<{x: number, y: number}>()
      .x(d => x(d.x))
      .y(d => y(d.y))
      .curve(d3.curveMonotoneX);

    svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#3b82f6')
      .attr('stroke-width', 3)
      .attr('d', line);

    // Add Area under line
    const area = d3.area<{x: number, y: number}>()
      .x(d => x(d.x))
      .y0(height)
      .y1(d => y(d.y))
      .curve(d3.curveMonotoneX);

    svg.append('path')
      .datum(data)
      .attr('fill', '#3b82f6')
      .attr('fill-opacity', 0.1)
      .attr('d', area);
      
    // Add dots
    svg.selectAll('dot')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', d => x(d.x))
      .attr('cy', d => y(d.y))
      .attr('r', 4)
      .attr('fill', 'white')
      .attr('stroke', '#2563eb')
      .attr('stroke-width', 2);
  }
}
