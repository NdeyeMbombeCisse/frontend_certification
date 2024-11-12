import { Component, inject, OnInit } from '@angular/core';
import { InformationModel } from '../../SuperAmin/information.model';
import { InformationService } from '../../../Services/information.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-information-encours',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './information-encours.component.html',
  styleUrl: './information-encours.component.css'
})
export class InformationEncoursComponent  implements OnInit{
  private informationService = inject(InformationService);
  tabInformation: InformationModel[] = [];


  ngOnInit(): void {
    this.fetchInformations();
  }
  fetchInformations() {
    this.informationService.getAllInformations().subscribe(
      (response: any) => {
        if (response.data) {
          this.tabInformation = response.data;
        }
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  private router = inject(Router)
  isActive(route: string): boolean {
    return this.router.url === route;
  }

  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
