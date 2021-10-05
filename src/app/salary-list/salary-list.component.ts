import { Component, OnInit } from '@angular/core';
import { Salary } from '../models/salary.model';
import { User } from '../models/user.model';
@Component({
  selector: 'app-salary-list',
  templateUrl: './salary-list.component.html',
  styleUrls: ['./salary-list.component.css']
})
export class SalaryListComponent implements OnInit {
  
  pageTitle: string = 'Salary List';
  user: User;
  testSalary: Salary[] = Salary.getTestData(22)
  salaryDetails: Salary | undefined;
  constructor() { }

  ngOnInit(): void {

    this.user = this.getTestUser();
  }
  showDetails(salary: Salary): void{
    if(this.salaryDetails?.id == salary.id){
      this.salaryDetails = undefined;
    }else this.salaryDetails = salary;
    
  }
  private getTestUser(): User{
    let user = new User();
    user.id = 1;
    user.salaries = Salary.getTestData(1);
    return user;
  }

  onSalaryDelete(deleteId: number): void{
    this.user.salaries = this.user.salaries.filter(x => x.id !== deleteId);
    this.salaryDetails = undefined;
  }
}
