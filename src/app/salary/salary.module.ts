import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalaryListComponent } from '../salary-list/salary-list.component'
import { SalaryDetailComponent } from '../salary-detail/salary-detail.component';
import { TimePeriodPipe } from '../pipes/time-period.pipe';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    SalaryListComponent,
    SalaryDetailComponent,
    TimePeriodPipe

  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      {path: 'salary', component: SalaryListComponent},
      {path: 'salary/:id', component: SalaryDetailComponent},
    ])
  ]
})
export class SalaryModule { }
