import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ScannerQRCodeConfig,
  ScannerQRCodeResult,
  NgxScannerQrcodeService,
  NgxScannerQrcodeComponent,
  ScannerQRCodeSelectedFiles,
  NgxScannerQrcodeModule,
  
  
} from 'ngx-scanner-qrcode';
import { SafePipe } from "../../scans/safe.pipe";
import { HttpClient } from '@angular/common/http'; 
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'my-app',
  templateUrl: './scan.component.html',
  styleUrls: ['./scan.component.scss'],
  imports: [
    FormsModule, // For form handling in Angular
    NgxScannerQrcodeModule // Importing the scanner QR code module
    ,
    CommonModule,
    SafePipe
],  standalone: true,
  
})
export class ScanComponent implements AfterViewInit {

  // https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia#front_and_back_camera
  public config: ScannerQRCodeConfig = {
    constraints: {
      video: {
        width: window.innerWidth
      },
    },
    // canvasStyles: [
    //   { /* layer */
    //     lineWidth: 1,
    //     fillStyle: '#00950685',
    //     strokeStyle: '#00950685',
    //   },
    //   { /* text */
    //     font: '17px serif',
    //     fillStyle: '#ff0000',
    //     strokeStyle: '#ff0000',
    //   }
    // ],
  };

  public qrCodeResult: ScannerQRCodeSelectedFiles[] = [];
  public qrCodeResult2: ScannerQRCodeSelectedFiles[] = [];
  public responseMessage: string = '';


  @ViewChild('action') action!: NgxScannerQrcodeComponent;

  public percentage = 80;
  public quality = 100;

  constructor(private qrcode: NgxScannerQrcodeService) { }
  private http = inject(HttpClient)

  ngAfterViewInit(): void {
    this.action.isReady.subscribe((response: any) => {
      // this.handle(this.action, 'start');
    });
  }

  public onEvent(e: ScannerQRCodeResult[]): void {
    if (e.length) {
      const qrCodeData = e[0].value; // Capture the QR code value
      this.validateReservation(qrCodeData); // Call validation function
    }
  }

  // public validateReservation(qrCodeData: string) {
  //   this.http.post('http://127.0.0.1:8000/api/validate-qr', { code: qrCodeData })
  //     .subscribe(
  //       (response: any) => {
  //         Swal.fire({
  //           title: 'Succès!',
  //           text: 'Voyage confirmee avec success!',
  //           icon: 'success',
  //           confirmButtonText: 'OK'
  //         });
  //         console.log('Response:', response);
  //       },
  //       (error: any) => {
  //         Swal.fire({
  //           icon: "error",
  //           title: "voyage deja effectue pour ce trajet",
  //           text: "Something went wrong!",
  //           footer: '<a href="#">Why do I have this issue?</a>'
  //         });
  //         console.error('Error:', error);
  //       }
  //     );
  // }

  public validateReservation(qrCodeData: string) {
    this.http.post('http://127.0.0.1:8000/api/validate-qr', { code: qrCodeData })
      .subscribe(
        (response: any) => {
          this.responseMessage = 'Voyage confirmé avec succès!'; // Update the response message
          Swal.fire({
            title: 'Succès!',
            text: this.responseMessage,
            icon: 'success',
            confirmButtonText: 'OK'
          });
          console.log('Response:', response);
        },
        (error: any) => {
          this.responseMessage = 'Erreur: voyage déjà effectué pour ce trajet.'; // Update the response message on error
          Swal.fire({
            icon: 'error',
            title: 'Erreur!',
            text: this.responseMessage,
            footer: '<a href="#">Pourquoi ai-je ce problème?</a>'
          });
          console.error('Error:', error);
        }
      );
  }

  public handle(action: any, fn: string): void {
    const playDeviceFacingBack = (devices: any[]) => {
      // front camera or back camera check here!
      const device = devices.find(f => (/back|rear|environment/gi.test(f.label))); // Default Back Facing Camera
      action.playDevice(device ? device.deviceId : devices[0].deviceId);
    }

    if (fn === 'start') {
      action[fn](playDeviceFacingBack).subscribe((r: any) => console.log(fn, r), alert);
    } else {
      action[fn]().subscribe((r: any) => console.log(fn, r), alert);
    }
  }

  public onDowload(action: NgxScannerQrcodeComponent) {
    action.download().subscribe(console.log, alert);
  }

  public onSelects(files: any) {
    this.qrcode.loadFiles(files, this.percentage, this.quality).subscribe((res: ScannerQRCodeSelectedFiles[]) => {
      this.qrCodeResult = res;
    });
  }

  public onSelects2(files: any) {
    this.qrcode.loadFilesToScan(files, this.config, this.percentage, this.quality).subscribe((res: ScannerQRCodeSelectedFiles[]) => {
      console.log(res);
      this.qrCodeResult2 = res;
    });
  }

  public onGetConstraints() {
    const constrains = this.action.getConstraints();
    console.log(constrains);
  }
  
  public applyConstraints() {
    const constrains = this.action.applyConstraints({
      ...this.action.getConstraints(),
      width: 510
    });
    console.log(constrains);
  }
}