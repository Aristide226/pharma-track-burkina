import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { Medicine } from '../../models/medicine';
import { Sale } from '../../models/sale';
import { BaseChartDirective } from 'ng2-charts'; 
import { ChartConfiguration, ChartType } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule,BaseChartDirective],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})

export class Dashboard implements OnInit{
  lowStockMedicines: Medicine[] = [];
  dailyRevenue: number = 0;
  dailySalesCount: number = 0;
  allMedicines: Medicine[] = [];

  // --- Propriétés pour le graphique ---
  public barChartType: ChartType = 'bar';
  public barChartData: ChartConfiguration['data'] = {
    labels: [],
    datasets: [{ data: [], label: 'Revenu Mensuel (FCFA)' }]
  };
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: { x: {}, y: { min: 0 } },
    plugins: { legend: { display: true } }
  };
  // ------------------------------------


  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getMedicines().subscribe(medicines => {
      this.allMedicines = medicines;
      this.checkLowStock();
    });

    this.apiService.getSales().subscribe(sales => {
      this.calculateDailyStats(sales);
    });

    this.apiService.getMedicines().subscribe(medicines => {
      this.allMedicines = medicines;
      this.checkLowStock();
      this.apiService.getSales().subscribe(sales => {
        this.calculateDailyStats(sales);
        this.calculateMonthlyStats(sales); // Nouvelle méthode
      });
    });
  }

  checkLowStock(): void {
    this.lowStockMedicines = this.allMedicines.filter(m => m.quantity < 10);
  }

  calculateDailyStats(sales: Sale[]): void {
    this.dailyRevenue = 0;
    this.dailySalesCount = 0;

    const today = new Date().toISOString().split('T')[0];

    sales.forEach(sale => {
      const saleDate = new Date(sale.date).toISOString().split('T')[0];
      if (saleDate === today) {
        this.dailySalesCount++;
        const soldMedicine = this.allMedicines.find(m => m.id === sale.medicineId);
        if (soldMedicine) {
          this.dailyRevenue += soldMedicine.price * sale.quantity;
        }
      }
    });
  }

  calculateMonthlyStats(sales: Sale[]): void {
    const monthlyData: { [key: string]: number } = {};

    sales.forEach(sale => {
      const saleDate = new Date(sale.date);
      // Créer une clé unique pour le mois (ex: '2025-09')
      const monthKey = saleDate.getFullYear() + '-' + (saleDate.getMonth() + 1).toString().padStart(2, '0');

      const soldMedicine = this.allMedicines.find(m => m.id === sale.medicineId);
      if (soldMedicine) {
        const revenue = soldMedicine.price * sale.quantity;
        monthlyData[monthKey] = (monthlyData[monthKey] || 0) + revenue;
      }
    });

    // Transformer les données agrégées pour le graphique
    const sortedKeys = Object.keys(monthlyData).sort();
    const chartLabels = sortedKeys.map(key => key); // Les mois (ex: '2024-09')
    const chartData = sortedKeys.map(key => monthlyData[key]);

    // Mettre à jour les données du graphique
    this.barChartData = {
      labels: chartLabels,
      datasets: [{ data: chartData, label: 'Revenu Mensuel (FCFA)', backgroundColor: '#4CAF50' }]
    };
  }

  
}
