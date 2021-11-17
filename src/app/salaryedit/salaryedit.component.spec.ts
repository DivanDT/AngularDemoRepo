import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryeditComponent } from './salaryedit.component';

describe('SalaryeditComponent', () => {
  let component: SalaryeditComponent;
  let fixture: ComponentFixture<SalaryeditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalaryeditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalaryeditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
