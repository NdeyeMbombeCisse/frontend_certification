import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-portail',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './portail.component.html',
  styleUrl: './portail.component.css'
})
export class PortailComponent {
  private router = inject(Router)
  isActive(route: string): boolean {
    return this.router.url === route;
  }

}
