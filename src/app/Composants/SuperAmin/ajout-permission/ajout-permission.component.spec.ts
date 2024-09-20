import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjoutPermissionComponent } from './ajout-permission.component';

describe('AjoutPermissionComponent', () => {
  let component: AjoutPermissionComponent;
  let fixture: ComponentFixture<AjoutPermissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AjoutPermissionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AjoutPermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
