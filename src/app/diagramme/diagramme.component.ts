import { Component, OnInit } from '@angular/core';
import { Chart, registerables, ChartOptions } from 'chart.js';


@Component({
  selector: 'app-diagramme',
  standalone: true,
  imports: [],
  templateUrl: './diagramme.component.html',
  styleUrl: './diagramme.component.css'
})
export class DiagrammeComponent implements OnInit{

ngOnInit(): void {
  setTimeout(() => {
    this.initializeChart();
  }, 0);
    
}

public chartType: 'bar' = 'bar'; // Changer 'line' à 'bar'

public chartLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

public chartData = [
  { data: [3.92, 3.31, 3.85, 3.60, 3.24, 3.22, 3.06, 3.37, 3.47, 3.79, 3.98, 3.73], label: 'Boston' },
  { data: [2.98, 3.11, 2.4, 0.63, 0.24, 0.08, 0.03, 0.14, 0.26, 0.36, 1.13, 1.79], label: 'Los Angeles' },
  { data: [5.24, 4.09, 3.92, 2.75, 2.03, 1.55, 0.93, 1.16, 1.61, 3.24, 5.67, 6.06], label: 'Seattle' }
];

// Options du graphique
public chartOptions: ChartOptions<'bar'> = {
  responsive: true,
  plugins: {
    legend: {
      display: true,
      position: 'top' as const // Assurez-vous que `position` soit une valeur de type littéral
    },
    tooltip: {
      enabled: true
    }
  }
};

constructor() {
  Chart.register(...registerables);
}


initializeChart() {
  const ctx = document.getElementById('lineChart') as HTMLCanvasElement;
  if (ctx) {
    new Chart(ctx, {
      type: this.chartType, // Utilisez le type de graphique défini
      data: {
        labels: this.chartLabels,
        datasets: this.chartData
      },
      options: this.chartOptions
    });
  } else {
    console.error('Élément Canvas introuvable !');
  }
}


}
