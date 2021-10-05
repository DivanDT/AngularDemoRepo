import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

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
  deleteSalary(): void{
    this.deleteClicked.emit(this.salary.id)
  }
  constructor() { }

  ngOnInit(): void {

  }

  @Output() backClicked: EventEmitter<number> = new EventEmitter<number>() ;

  onEdit():void{

  }
}
