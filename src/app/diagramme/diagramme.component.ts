// import { Component, OnInit } from '@angular/core';
// import { Chart, registerables, ChartOptions } from 'chart.js';

// @Component({
//   selector: 'app-diagramme',
//   standalone: true,
//   templateUrl: './diagramme.component.html',
//   styleUrls: ['./diagramme.component.css']
// })
// export class DiagrammeComponent implements OnInit {

//   ngOnInit(): void {
//     setTimeout(() => {
//       this.initializeChart();
//     }, 0);
//   }

//   public chartType: 'bar' = 'bar';

//   // Les jours de la semaine
//   public chartLabels = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

//   // Données pour chaque catégorie (trajets, réservations, voyages)
//   public chartData = [
//     { data: [12, 19, 3, 5, 2, 3, 9], label: 'Trajets publiés', backgroundColor: 'rgba(54, 162, 235, 0.5)', borderColor: 'rgba(54, 162, 235, 1)' },
//     { data: [9, 15, 2, 3, 2, 3, 7], label: 'Réservations enregistrées', backgroundColor: 'rgba(255, 206, 86, 0.5)', borderColor: 'rgba(255, 206, 86, 1)' },
//     { data: [5, 10, 1, 2, 1, 1, 4], label: 'Voyages effectués', backgroundColor: 'rgba(75, 192, 192, 0.5)', borderColor: 'rgba(75, 192, 192, 1)' }
//   ];

//   // Options du graphique
//   public chartOptions: ChartOptions<'bar'> = {
//     responsive: true,
//     plugins: {
//       legend: {
//         display: true,
//         position: 'top'
//       },
//       tooltip: {
//         enabled: true
//       }
//     },
//     scales: {
//       y: {
//         beginAtZero: true // Assurez-vous que les valeurs commencent à 0
//       }
//     }
//   };

//   constructor() {
//     Chart.register(...registerables);
//   }

//   initializeChart() {
//     const ctx = document.getElementById('lineChart') as HTMLCanvasElement;
//     if (ctx) {
//       new Chart(ctx, {
//         type: this.chartType, 
//         data: {
//           labels: this.chartLabels,
//           datasets: this.chartData
//         },
//         options: this.chartOptions
//       });
//     } else {
//       console.error('Élément Canvas introuvable !');
//     }
//   }
// }



import { Component, OnInit, inject } from '@angular/core';
import { Chart, registerables, ChartOptions } from 'chart.js';
import { ReservationService } from '../Services/reservation.service';
import { TrajetService } from '../Services/trajet.service';

// Définir des interfaces pour les réponses des API
interface TrajetsResponse {
  labels: string[];
  trajets: number[];
}

interface ReservationsResponse {
  labels: string[];
  reservations: number[];
}

interface VoyagesResponse {
  labels: string[];
  voyages: number[];
}

@Component({
  selector: 'app-diagramme',
  standalone: true,
  templateUrl: './diagramme.component.html',
  styleUrls: ['./diagramme.component.css']
})
export class DiagrammeComponent implements OnInit {

  public chartType: 'bar' = 'bar';
  public chartLabels: string[] = [];
  public chartData: {
    data: number[];
    label: string;
    backgroundColor: string;
    borderColor: string;
  }[] = []; // Typage des données du graphique

  private trajetService = inject(TrajetService);
  private reservationService = inject(ReservationService); // Utilisation de inject

  public chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      },
      tooltip: {
        enabled: true
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  ngOnInit(): void {
    // Enregistrer les éléments nécessaires pour Chart.js
    Chart.register(...registerables);
    this.loadChartData();
  }

  loadChartData() {
    // Appeler les services pour récupérer les données
    this.trajetService.getTrajetsByWeek().subscribe(
      (trajetsData: any) => {
        this.reservationService.getReservationsByWeek().subscribe(
          (reservationsData: any) => {
            this.reservationService.getVoyagesEffectuesByWeek().subscribe(
              (voyagesData: any) => {
                this.chartLabels = trajetsData.labels;

                this.chartData = [
                  {
                    data: trajetsData.trajets,
                    label: 'Trajets publiés',
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                    borderColor: 'rgba(54, 162, 235, 1)'
                  },
                  {
                    data: reservationsData.reservations,
                    label: 'Réservations enregistrées',
                    backgroundColor: 'rgba(255, 206, 86, 0.5)',
                    borderColor: 'rgba(255, 206, 86, 1)'
                  },
                  {
                    data: voyagesData.voyages,
                    label: 'Voyages effectués',
                    backgroundColor: 'rgba(75, 192, 192, 0.5)',
                    borderColor: 'rgba(75, 192, 192, 1)'
                  }
                ];

                this.initializeChart();
              },
              error => {
                console.error('Erreur lors de la récupération des données de voyages:', error);
              }
            );
          },
          error => {
            console.error('Erreur lors de la récupération des données de réservations:', error);
          }
        );
      },
      error => {
        console.error('Erreur lors de la récupération des données de trajets:', error);
      }
    );
  }

  initializeChart() {
    const ctx = document.getElementById('lineChart') as HTMLCanvasElement;
    if (ctx) {
      new Chart(ctx, {
        type: this.chartType,
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
