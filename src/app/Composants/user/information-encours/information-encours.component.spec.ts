import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformationEncoursComponent } from './information-encours.component';

describe('InformationEncoursComponent', () => {
  let component: InformationEncoursComponent;
  let fixture: ComponentFixture<InformationEncoursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InformationEncoursComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InformationEncoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
