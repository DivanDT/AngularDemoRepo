import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SalaryListComponent } from './salary-list/salary-list.component';
import { TimePeriodPipe } from './pipes/time-period.pipe';

@NgModule({
  declarations: [
    AppComponent,
    SalaryListComponent,
    TimePeriodPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
