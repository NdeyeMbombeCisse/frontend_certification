import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AfficherTrajetComponent } from './afficher-trajet.component';

describe('AfficherTrajetComponent', () => {
  let component: AfficherTrajetComponent;
  let fixture: ComponentFixture<AfficherTrajetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AfficherTrajetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AfficherTrajetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
