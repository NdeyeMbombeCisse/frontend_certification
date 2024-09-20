import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjoutinformationComponent } from './ajoutinformation.component';

describe('AjoutinformationComponent', () => {
  let component: AjoutinformationComponent;
  let fixture: ComponentFixture<AjoutinformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AjoutinformationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AjoutinformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
