import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Salary } from '../models/salary.model';
import { TaxDate } from '../models/tax-date.model';
import { TaxMonth } from '../models/tax-month.model';
import { TaxYear } from '../models/tax-year.model';
import { TimePeriod } from '../models/time-period.model';


export class salarydata implements InMemoryDbService{
  Salaries: Salary = new Salary()
  createDb() {
    return {Salaries: [
      {
        id: 1,
        userId: 22,
        companyName: 'KPMG',
        salaryAmount: 12335.43,
        currencyCode: 'R',
        timePeriod: TimePeriod.PerMonth,
        taxYear: undefined,
        taxMonth: new TaxMonth('Jan','2021'),
        taxDate: undefined,
      },
      {
        id: 2,
        userId: 22,
        companyName: 'Bitcube',
        salaryAmount: 100,
        currencyCode: 'GBP',
        timePeriod: TimePeriod.PerDay,
        taxYear: undefined,
        taxMonth: undefined,
        taxDate: new TaxDate('17','Apr','2018'),
      },{
        id: 3,
        userId: 22,
        companyName: 'Inplenion',
        salaryAmount: 200000,
        currencyCode: 'R',
        timePeriod: TimePeriod.PerTaxYear,
        taxYear: new TaxYear('1819'),
        taxMonth: undefined,
        taxDate: undefined,
      },{
        id: 4,
        userId: 22,
        companyName: 'Galaxy',
        salaryAmount: 25000.99,
        currencyCode: 'R',
        timePeriod: TimePeriod.PerMonth,
        taxYear: undefined,
        taxMonth: new TaxMonth('Feb','2020'),
        taxDate: undefined,
      },{
        id: 5,
        userId: 22,
        companyName: 'Samsung',
        salaryAmount: 20.43,
        currencyCode: 'GBP',
        timePeriod: TimePeriod.PerDay,
        taxYear: undefined,
        taxMonth: undefined,
        taxDate: new TaxDate('1','Des','2019'),
      },{
        id: 6,
        userId: 22,
        companyName: 'Radiolab',
        salaryAmount: 6024.99,
        currencyCode: 'USD',
        timePeriod: TimePeriod.PerTaxYear,
        taxYear: new TaxYear('1617'),
        taxMonth: undefined,
        taxDate: undefined,
      },{
        id: 7,
        userId: 22,
        companyName: 'My test company 3',
        salaryAmount: 300,
        currencyCode: 'R',
        timePeriod: TimePeriod.PerDay,
        taxYear: undefined,
        taxMonth: undefined,
        taxDate: new TaxDate('28','Sep','2013'),
      },{
        id: 8,
        userId: 22,
        companyName: 'My test company 4',
        salaryAmount: 12335.43,
        currencyCode: 'R',
        timePeriod: TimePeriod.PerMonth,
        taxYear: undefined,
        taxMonth: new TaxMonth('Nov','2017'),
        taxDate: undefined,
      }
    ]};
  }


  constructor() { }
}
