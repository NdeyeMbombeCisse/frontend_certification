import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilnotifComponent } from './profilnotif.component';

describe('ProfilnotifComponent', () => {
  let component: ProfilnotifComponent;
  let fixture: ComponentFixture<ProfilnotifComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilnotifComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProfilnotifComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
