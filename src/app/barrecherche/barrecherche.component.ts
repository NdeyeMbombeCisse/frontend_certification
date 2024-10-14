import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-barrecherche',
  standalone: true,
  imports: [],
  templateUrl: './barrecherche.component.html',
  styleUrl: './barrecherche.component.css'
})
export class BarrechercheComponent {
  @Output() rechercheEffectuée: EventEmitter<string> = new EventEmitter<string>();
  termeRecherche: string = '';

  onSearch() {
    this.rechercheEffectuée.emit(this.termeRecherche);
  }
}
