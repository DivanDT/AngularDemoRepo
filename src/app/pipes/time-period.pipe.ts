import { Pipe, PipeTransform } from '@angular/core';
import { TimePeriod } from '../models/time-period.model';

@Pipe({
  name: 'timePeriodPipe'
})
export class TimePeriodPipe implements PipeTransform {

  transform(value: TimePeriod, ...args: unknown[]): string {
    if(value == TimePeriod.PerDay) return 'On Date';
    if(value == TimePeriod.PerMonth) return 'Per Month';
    if(value == TimePeriod.PerTaxYear) return 'Per Tax Year';

    return 'NA';
  }

}
