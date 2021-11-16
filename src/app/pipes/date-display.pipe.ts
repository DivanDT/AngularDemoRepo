import { Pipe, PipeTransform } from '@angular/core';
import { Salary } from '../models/salary.model';


@Pipe({
  name: 'dateDisplay'
})
export class DateDisplayPipe implements PipeTransform {

  transform(value: Salary, ...args: unknown[]): string {
    if(value.taxYear&&value.timePeriod=='PY'){
      return value.taxYear.year.substr(0,2)+'/'+value.taxYear.year.substr(2,2) + ' Tax Year';
      
    
    }
    if(value.taxMonth&&value.timePeriod=='PM'){
      return value.taxMonth.month + '-' + value.taxMonth.year;
    }
    if(value.taxDate&&value.timePeriod=='PD'){
      return value.taxDate.day + '-' + value.taxDate.month + '-' + value.taxDate.year;
    }

    return 'ERROR'
  }

}
