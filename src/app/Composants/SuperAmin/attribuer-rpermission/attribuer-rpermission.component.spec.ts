import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttribuerRpermissionComponent } from './attribuer-rpermission.component';

describe('AttribuerRpermissionComponent', () => {
  let component: AttribuerRpermissionComponent;
  let fixture: ComponentFixture<AttribuerRpermissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttribuerRpermissionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AttribuerRpermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
