import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierTrajetComponent } from './modifier-trajet.component';

describe('ModifierTrajetComponent', () => {
  let component: ModifierTrajetComponent;
  let fixture: ComponentFixture<ModifierTrajetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifierTrajetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModifierTrajetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
