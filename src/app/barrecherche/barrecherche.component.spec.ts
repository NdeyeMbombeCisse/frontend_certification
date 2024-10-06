import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarrechercheComponent } from './barrecherche.component';

describe('BarrechercheComponent', () => {
  let component: BarrechercheComponent;
  let fixture: ComponentFixture<BarrechercheComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarrechercheComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BarrechercheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
