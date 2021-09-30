import { Component, OnInit } from '@angular/core';
import { Salary } from '../models/salary.model';
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
