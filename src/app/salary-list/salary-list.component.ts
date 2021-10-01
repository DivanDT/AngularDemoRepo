import { Component, OnInit } from '@angular/core';
import { Salary } from '../models/salary.model';

import { TaxYear } from '../models/tax-year.model';
import { TaxMonth } from '../models/tax-month.model';
import { TaxDate } from '../models/tax-date.model';
@Component({
  selector: 'app-salary-list',
  templateUrl: './salary-list.component.html',
  styleUrls: ['./salary-list.component.css']
})
export class SalaryListComponent implements OnInit {
  pageTitle: string = 'Salary List';
  testSalary: Salary[] = Salary.getTestData(22)
  
  constructor() { }

  ngOnInit(): void {
  }

}
