import { Component, OnInit } from '@angular/core';
import { Salary } from '../models/salary.model';

import { TaxYear } from '../models/tax-year.model';
import { TaxMonth } from '../models/tax-month.model';
import { TaxDate } from '../models/tax-date.model';
import { User } from '../models/user.model';
@Component({
  selector: 'app-salary-list',
  templateUrl: './salary-list.component.html',
  styleUrls: ['./salary-list.component.css']
})
export class SalaryListComponent implements OnInit {
  
  pageTitle: string = 'Salary List';
  showDetails: boolean[] = [];
  user: User;
  testSalary: Salary[] = Salary.getTestData(22)
  
  constructor() { }

  ngOnInit(): void {

    this.user = this.getTestUser();
  }
  onDetails(showNum: number): void{
    this.user.salaries[showNum-1].showDetails = !this.user.salaries[showNum-1].showDetails;
  }
  private getTestUser(): User{
    let user = new User();
    user.id = 1;
    user.salaries = Salary.getTestData(1);
    return user;
  }

  getDateDisplayString(salary: Salary): string{
    if(salary.taxYear){
      return salary.taxYear.year + ' Tax Year';
    }
    if(salary.taxMonth){
      return salary.taxMonth.month + '-' + salary.taxMonth.year;
    }
    if(salary.taxDate){
      return salary.taxDate.day + '-' + salary.taxDate.month + '-' + salary.taxDate.year;
    }

    return 'ERROR'
  }
  onDelete(deleteId: number): void{
    let newSalaries: Salary[] = [];
    for (let index = 0; index < this.user.salaries.length; index++) {
      const element = this.user.salaries[index];
      if(element.id!=deleteId){
        newSalaries.push(element)
      }
    }
    this.user.salaries=newSalaries
  }

}
