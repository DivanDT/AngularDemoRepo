import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Salary } from '../models/salary.model';

@Component({
  selector: 'app-salary-detail',
  templateUrl: './salary-detail.component.html',
  styleUrls: ['./salary-detail.component.css']
})
export class SalaryDetailComponent implements OnInit {
  pageTitle: string = "Salary Detail"
  @Input() salary: Salary ;
  @Output() deleteClicked: EventEmitter<number> = new EventEmitter<number>() ;
  onDelete(): void{
    this.deleteClicked.emit(this.salary.id)
  }
  constructor(private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit(): void {
    /*const id = Number(this.route.snapshot.paramMap.get('id'));
    this.pageTitle += `: ${id}`;
    let salarray: Salary[] = Salary.getTestData(1); 
    for (let index = 0; index < salarray.length; index++) {
      const element = salarray[index];
      if(element.id==id){
        //this.salary = element
      }
    }*/
  }

  @Output() backClicked: EventEmitter<number> = new EventEmitter<number>() ;
  onBack(): void{
    this.backClicked.emit(this.salary.id);
  }

  onEdit():void{

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
}
