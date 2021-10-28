import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalaryListComponent } from '../salary-list/salary-list.component'
import { SalaryDetailComponent } from '../salary-detail/salary-detail.component';
import { TimePeriodPipe } from '../pipes/time-period.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DateDisplayPipe } from '../pipes/date-display.pipe';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { HttpClientModule } from '@angular/common/http';
import { salarydata } from './salarydata';
import { SalaryeditComponent } from '../salaryedit/salaryedit.component';

@NgModule({
  declarations: [
    SalaryListComponent,
    SalaryDetailComponent,
    SalaryeditComponent,
    TimePeriodPipe,
    DateDisplayPipe,
    
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    InMemoryWebApiModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    InMemoryWebApiModule.forRoot(salarydata, { dataEncapsulation: false }),
    RouterModule.forChild([
      {path: 'salary', component: SalaryListComponent},
      {path: 'salary/:id', component: SalaryDetailComponent},
      {path: 'salary/:id/edit', component: SalaryeditComponent}

    ])
  ]
})
export class SalaryModule { }
