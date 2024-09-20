import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierbateauComponent } from './modifierbateau.component';

describe('ModifierbateauComponent', () => {
  let component: ModifierbateauComponent;
  let fixture: ComponentFixture<ModifierbateauComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifierbateauComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModifierbateauComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
