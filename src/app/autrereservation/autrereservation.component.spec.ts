import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutrereservationComponent } from './autrereservation.component';

describe('AutrereservationComponent', () => {
  let component: AutrereservationComponent;
  let fixture: ComponentFixture<AutrereservationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AutrereservationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AutrereservationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
