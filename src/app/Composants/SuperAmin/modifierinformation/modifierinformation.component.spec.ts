import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierinformationComponent } from './modifierinformation.component';

describe('ModifierinformationComponent', () => {
  let component: ModifierinformationComponent;
  let fixture: ComponentFixture<ModifierinformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifierinformationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModifierinformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
