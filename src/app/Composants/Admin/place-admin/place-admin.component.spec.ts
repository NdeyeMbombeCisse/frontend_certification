import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaceAdminComponent } from './place-admin.component';

describe('PlaceAdminComponent', () => {
  let component: PlaceAdminComponent;
  let fixture: ComponentFixture<PlaceAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlaceAdminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PlaceAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
