import { Pipe, PipeTransform } from '@angular/core';
import { Salary } from '../models/salary.model';


@Pipe({
  name: 'dateDisplay'
})
export class DateDisplayPipe implements PipeTransform {

  transform(value: Salary, ...args: unknown[]): string {
    if(value.taxYear){
      return value.taxYear.year.substr(0,2)+'/'+value.taxYear.year.substr(2,2) + ' Tax Year';
    }
    if(value.taxMonth){
      return value.taxMonth.month + '-' + value.taxMonth.year;
    }
    if(value.taxDate){
      return value.taxDate.day + '-' + value.taxDate.month + '-' + value.taxDate.year;
    }

    return 'ERROR'
  }

}
