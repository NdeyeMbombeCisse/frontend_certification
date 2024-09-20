import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailTrajetComponent } from './detail-trajet.component';

describe('DetailTrajetComponent', () => {
  let component: DetailTrajetComponent;
  let fixture: ComponentFixture<DetailTrajetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailTrajetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetailTrajetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
