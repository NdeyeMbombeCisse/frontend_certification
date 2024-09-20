import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjoutBateauComponent } from './ajout-bateau.component';

describe('AjoutBateauComponent', () => {
  let component: AjoutBateauComponent;
  let fixture: ComponentFixture<AjoutBateauComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AjoutBateauComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AjoutBateauComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
