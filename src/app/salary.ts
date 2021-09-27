export enum period{
    year,
    month,
    date,
}

export enum currency{
    USD,
    ZAR,
    GBP,
    YEN,
    AUD
}

export class salaryInfo{
    companyName!: string;
    userPeriod!: period;
    salaryAmount!: number;
    salaryCurrency!: currency;
    salaryStart!: Date;
    salaryEnd!: Date;
    /**
     *
     */
    constructor(companyName:string, userPeriod:period,salaryAmount:number,salaryCurrency:currency, salaryStart:Date) {
        this.companyName = companyName;
        this.userPeriod = userPeriod;
        this.salaryAmount = salaryAmount;
        this.salaryCurrency = salaryCurrency;
        this.salaryStart = salaryStart;
        this.salaryEnd = salaryStart;
        //will for now use function constructor set enddate depending on period

        if(userPeriod==period.year){
            let year = salaryStart.getFullYear();
            //day will always be 05 april
            this.salaryEnd.setDate(5);
            this.salaryEnd.setFullYear(year+1);
        }

        if(userPeriod==period.month){
            let month = salaryStart.getMonth()
            this.salaryEnd.setMonth(month+1)
        }

        if(userPeriod==period.date){
            
        }

    }
}

export function mockData(){

    let salaryMock:salaryInfo[]= new Array();
    salaryMock[0] = new salaryInfo('Inplenion',period.year,100000,currency.ZAR,new Date("2021-04-06"))
    salaryMock[1] = new salaryInfo('Bitcube',period.month,20000,currency.ZAR,new Date("2021-02-01"))
    salaryMock[2] = new salaryInfo('Psybergate',period.date,1000,currency.ZAR,new Date("2021-07-22"))
    salaryMock[3] = new salaryInfo('KPMG',period.month,30000,currency.ZAR,new Date("2020-02-01"))
    salaryMock[4] = new salaryInfo('Capitec',period.year,200000,currency.ZAR,new Date("2020-04-06"))
    return salaryMock;
}