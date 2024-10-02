import { CommonModule } from '@angular/common';
import { Component, Inject, inject, ViewChild } from '@angular/core';
import { NgxScannerQrcodeComponent, NgxScannerQrcodeModule, NgxScannerQrcodeService, ScannerQRCodeConfig, ScannerQRCodeResult, ScannerQRCodeSelectedFiles } from 'ngx-scanner-qrcode';
import { SafePipe } from './safe.pipe';
import { ReservationService } from '../Services/reservation.service';

@Component({
  selector: 'app-scan',
  standalone: true,
  imports: [ NgxScannerQrcodeModule,CommonModule],
  templateUrl: './scan.component.html',
  styleUrl: './scan.component.css'
})
export class ScanComponent {
  scannedData: string | null = null;

  private reservationService=Inject (ReservationService);

  onEvent(event: any) {
    this.scannedData = event;
    if (this.scannedData) { // Vérifiez que scannedData n'est pas null
      this.validateQRCode(this.scannedData);
    } else {
      console.error('Données scannées sont nulles.');
      // Affichez un message d'erreur à l'utilisateur si nécessaire
    }
  }

  validateQRCode(code: string) {
    this.reservationService.validateQRCode({ code }).subscribe(
      (response:any) => {
        console.log('Validation réussie :', response);
        // Afficher un message de succès ou rediriger l'utilisateur
      },
     (error :any) => {
        console.error('Erreur de validation :', error);
        // Afficher un message d'erreur
      }
    );
  }
}
