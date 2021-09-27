import { TaxDate } from "./tax-date.model";
import { TaxMonth } from "./tax-month.model";
import { TaxYear } from "./tax-year.month"
import { TimePeriod } from "./time-period.model"

export class Salary {
    id: number;
    userId: number;
    companyName: string;
    timePeriod: TimePeriod;
    salaryAmount: number;
    currencyCode: string;

    //timePeriodActual: string;
    
    taxDate?: TaxDate;
    taxMonth?: TaxMonth;
    taxYear?: TaxYear;

    static getTestData(userId: number): Salary[] {
        let result: Salary[] = [];

        let id: number = 1;
        

        //tax month salary
        let taxMonth = new TaxMonth();
        taxMonth.month = 'Jan';
        taxMonth.year = '2021';
        result.push(this.getTestSalary(id,userId,'KPMG',12335.43, 'ZAR',TimePeriod.PerMonth,undefined,taxMonth,undefined))
        
        //tax date salary
        id++;
        let taxDate = new TaxDate();
        taxDate.day = '17';
        taxDate.month = 'Apr';
        taxDate.year = '1718';
        result.push(this.getTestSalary(id,userId,'Bitcube',100, 'GBP',TimePeriod.PerTaxYear,undefined,undefined,taxDate))
        
        //tax year salary
        id++;
        let taxYear = new TaxYear();
        taxYear.year = '1819';
        result.push(this.getTestSalary(id,userId,'Inplenion',200000, 'ZAR',TimePeriod.PerTaxYear,taxYear,undefined,undefined))
        
        //tax month salary
        let taxM = new TaxMonth();
        taxM.month = 'Feb';
        taxM.year = '1920';
        result.push(this.getTestSalary(id,userId,'Galaxy',25000.99, 'ZAR',TimePeriod.PerMonth,undefined,taxM,undefined))
        
        //tax date salary
        id++;
        let taxD = new TaxDate();
        taxD.day = '1';
        taxD.month = 'Des';
        taxD.year = '1920';
        result.push(this.getTestSalary(id,userId,'Samsung',20.43, 'GBP',TimePeriod.PerTaxYear,undefined,undefined,taxD))
        
        //tax year salary
        id++;
        let taxY = new TaxYear();
        taxY.year = '1617';
        result.push(this.getTestSalary(id,userId,'Radiolab',999090, 'USD',TimePeriod.PerTaxYear,taxY,undefined,undefined))
        
        //tax date salary
        id++;
        let tD = new TaxDate();
        tD.day = '28';
        tD.month = 'Sep';
        tD.year = '2021';
        result.push(this.getTestSalary(id,userId,'My test company 3',12335.43, 'GBP',TimePeriod.PerTaxYear,undefined,undefined,tD))
        
        //tax year salary
        id++;
        let tY = new TaxYear();
        tY.year = '1314';
        result.push(this.getTestSalary(id,userId,'My test company 4',12335.43, 'ZAR',TimePeriod.PerTaxYear,tY,undefined,undefined))
        
        return result    
    }
    static getTestSalary(
        id: number,
        userId: number,
        companyName: string,
        salaryAmount: number,
        currencyCode: string,
        timePeriod: TimePeriod,
        taxYear?: TaxYear,
        TaxMonth?: TaxMonth,
        TaxDate?: TaxDate
        
    ): Salary {
        var result = new Salary()
        result.id = id;
        result.userId = userId;
        result.companyName = companyName;
        result.salaryAmount = salaryAmount;
        result.currencyCode = currencyCode;
        result.timePeriod = timePeriod;
        return result
    }
    
}