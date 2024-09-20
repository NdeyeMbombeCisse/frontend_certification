import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeTrajetComponent } from './liste-trajet.component';

describe('ListeTrajetComponent', () => {
  let component: ListeTrajetComponent;
  let fixture: ComponentFixture<ListeTrajetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListeTrajetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListeTrajetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
