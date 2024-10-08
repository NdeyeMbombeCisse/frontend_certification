import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboadAdminComponent } from './dashboad-admin.component';

describe('DashboadAdminComponent', () => {
  let component: DashboadAdminComponent;
  let fixture: ComponentFixture<DashboadAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboadAdminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DashboadAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
