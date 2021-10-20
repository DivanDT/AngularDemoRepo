import { TaxDate } from "./tax-date.model";
import { TaxMonth } from "./tax-month.model";
import { TaxYear } from "./tax-year.model";
import { TimePeriod } from "./time-period.model";

export class Salary {
    id: number;
    userId: number;
    companyName: string;
    timePeriod: TimePeriod;
    salaryAmount: number;
    currencyCode: string;
    showDetails: boolean;
    taxDate?: TaxDate;
    taxMonth?: TaxMonth;
    taxYear?: TaxYear;
    
    
    
}
