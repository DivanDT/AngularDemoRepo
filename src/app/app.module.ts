import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TimePeriodPipe } from './pipes/time-period.pipe';
import { SalaryListComponent } from './salary-list/salary-list.component';
import { SalaryDetailComponent } from './salary-detail/salary-detail.component';
import { RouterModule } from '@angular/router';
import { WelcomeComponent } from './home/welcome/welcome.component';

@NgModule({
  declarations: [
    AppComponent,
    SalaryListComponent,
    TimePeriodPipe,
    SalaryDetailComponent,
    WelcomeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot([
      {path: 'salary', component: SalaryListComponent},
      {path: 'salary/:id', component: SalaryDetailComponent},
      {path: 'welcome',component: WelcomeComponent},
      {path: '',redirectTo: 'welcome',pathMatch: 'full'} ,
      {path: '**',redirectTo: 'welcome',pathMatch: 'full'} 
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
