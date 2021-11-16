import { Component, OnInit } from '@angular/core';
import { Salary } from '../models/salary.model';
import { TimePeriod } from '../models/time-period.model';
import { User } from '../models/user.model';
import { SalaryService } from '../salary/salary.service';

@Component({
  selector: 'app-salary-list',
  templateUrl: './salary-list.component.html',
  styleUrls: ['./salary-list.component.css']
})
export class SalaryListComponent implements OnInit {
  errorMessage = '';
  pageTitle: string = 'Salary List';
  user: User;
  salaryDetails: Salary | undefined;
  allPeriods = [TimePeriod.PerDay,TimePeriod.PerMonth,TimePeriod.PerTaxYear];
  filteredSalary: Salary[];
  
  //Search parameter
  private _listSearch: string = '';
  get listSearch(): string {
    return this._listSearch;
  }
  set listSearch(value: string) {
    this._listSearch = value;
    this.filteredSalary = this.performSearch(value);
    this.salaryDetails = undefined;
  }
  
  //Filter parameter
  private _filterPeriod: TimePeriod;
  get filterPeriod(): TimePeriod{
    return this._filterPeriod;
  }
  set filterPeriod(value: TimePeriod){
    this._filterPeriod = value;
    this.filteredSalary = this.performSearch(this.listSearch)
    this.filteredSalary = this.performPeriodFilter(value)
    this.salaryDetails = undefined;
  }


  
  
  performPeriodFilter(filterPeriod: TimePeriod): Salary[] {
    if(!filterPeriod){
      return this.filteredSalary
    }else{
      return this.filteredSalary.filter((sal: Salary) =>
      sal.timePeriod.includes(filterPeriod))
    }
  }
  
  performSearch(filterBy: string): Salary[] {
    filterBy = filterBy.toLocaleLowerCase();
    this.filteredSalary = this.user.salaries.filter((sal: Salary) =>
      sal.companyName.toLocaleLowerCase().includes(filterBy));
    return this.performPeriodFilter(this.filterPeriod)
  }
  constructor(private salaryService: SalaryService) { }

  ngOnInit(): void {
    this.user = new User;
    this.salaryService.getSalaries().subscribe({
      next: salaries => {
        this.user.salaries = salaries;
        this.filteredSalary = this.user.salaries;
      },
      error: err => this.errorMessage = err
    });
    this.listSearch = '';
  }


  showDetails(salary: Salary): void{
    if(this.salaryDetails?.id == salary.id){
      this.salaryDetails = undefined;
    }else this.salaryDetails = salary;
    
  }

  onSalaryDelete(deleteId: number): void{
    if (confirm(`Really delete the salary: ${this.salaryDetails?.companyName}?`)) {
      this.salaryService.deleteSalary(deleteId)
        .subscribe({
          next: () => {this.salaryDetails = undefined, this.ngOnInit()},
          error: err => this.errorMessage = err
        });
      }
  }
}
