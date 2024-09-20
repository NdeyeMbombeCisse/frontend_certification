import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrajetEnCoursComponent } from './trajet-en-cours.component';

describe('TrajetEnCoursComponent', () => {
  let component: TrajetEnCoursComponent;
  let fixture: ComponentFixture<TrajetEnCoursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrajetEnCoursComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TrajetEnCoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
