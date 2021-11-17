import { AfterViewInit, Component, OnInit, ViewChildren, ElementRef } from '@angular/core';
import { FormGroup, Validators, FormControlName, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription, fromEvent, merge } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Salary } from '../models/salary.model';
import { TaxDate } from '../models/tax-date.model';
import { TaxMonth } from '../models/tax-month.model';
import { TaxYear } from '../models/tax-year.model';
import { TimePeriod } from '../models/time-period.model';
import { SalaryService } from '../salary/salary.service';
@Component({
  selector: 'app-salaryedit',
  templateUrl: './salaryedit.component.html',
  styleUrls: ['./salaryedit.component.css']
})
export class SalaryeditComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];
  editForm: FormGroup;
  salary: Salary;
  tp = [TimePeriod.PerDay,TimePeriod.PerMonth,TimePeriod.PerTaxYear] as const;
  id: number;
  pageTitle: string = "Salary Edit";
  private sub: Subscription;
  time: string;
  dayPeriods: string[][];
  monthPeriods: string[];
  yearPeriods: string[];
  displayMessage: { [key: string]: any } = {};
  testMessage: string = ' ';
  errorMessage: string;
  currency: string[] = ['ZAR','GBP','USD','CAD','EUR']

  //private validationMessages: { [key: string]: { [key: string]: string } };
  private validationMessages: { [key: string]: any };
  constructor(private fb: FormBuilder,private route: ActivatedRoute, private salaryService: SalaryService, private router: Router) {
    // Defines all of the validation messages for the form.
    this.validationMessages = {
      companyName: {
        required: 'Company Name Required',
        minlength: 'Company Name Too Short (Min Length: 2)',
        maxlength: 'Company Name Too Long (Max Length: 100)'
    },
    timePeriod: {
        required: 'Time Period Required',
    },
    dateday: {
      required: 'Day Required'
    },
    datemonth: {
      required: 'Month Required'
    },
    dateyear: {
      required: 'Year Required'
    },
    tempMonth: {
        required: 'Month Required'
    },
    year: {
      required: 'Year Required'
    },
    salaryAmount: {
        required: 'Salary Required',
        min: 'Below Minimum (Min value: 0.02)',
        max: 'Above Maximum (Max value: 1000000'
    },
    currencyCode: {
        required: 'Currency Code Required'
    }
    }
    //set functions for dropdown box dates
    this.dayPeriods = this.setDayPeriods();
    this.monthPeriods = this.setMonthPeriods();
    this.yearPeriods = this.setYearPeriods();

  }

  
  
  ngOnInit(): void {

    //formgroup
    this.editForm = this.fb.group({
      companyName: ['',[ 
                        Validators.required,
                        Validators.minLength(2),
                        Validators.maxLength(100)]],
      timePeriod: ['',[ Validators.required]],
      taxYear: this.fb.group({
        year: '',}
      ),
      tempMonth: ['',Validators.required],
      taxDate: this.fb.group({
        dateyear: '',
        datemonth: '',
        dateday: ''}
      ),
      salaryAmount: [0,  [Validators.required,
                          Validators.min(0.01),
                          Validators.max(1000000)]],
      currencyCode: ['',Validators.required]
    });

    //Subscribing to parameter
    this.sub = this.route.paramMap.subscribe(
      params => {
        const id = Number(params.get('id'));
        this.id = id;
        this.getSalary(id);
        
      }
    );


    //sets correct number of days for each month using Date.getDate()
    this.editForm.get('taxDate')?.get('datemonth').valueChanges.subscribe(x => {
      this.setDaysInMonth(this.editForm.get('taxDate')?.get('dateyear').value,x);
    })

    //makes dropdown more robust
    this.editForm.get('taxDate')?.get('dateyear').valueChanges.subscribe(x => {
      this.setDaysInMonth(x,this.editForm.get('taxDate')?.get('datemonth').value);
    })
    
  }

  setDaysInMonth(year: string, month: string){

    //fixes day cannot be chosen if year is not chosen
    if(year==undefined){
      year = '2021'
    }
    if(month==undefined){
      month = 'Jan'
    }
    //use currentDay so date is not lost
    let currentDay = this.editForm.get('taxDate').get('dateday').value
    //get month index from month name
    let monthNum = this.dayPeriods[1].findIndex(x => x == month)
    //get number of days in specific month using getDate()
    let numDays = new Date(parseInt(year),monthNum+1,0).getDate();
    let days: string[] = []
    for (numDays; numDays > 0; numDays--) {
      days.push(numDays.toString())
    }
    this.dayPeriods[0] = days
    this.editForm.get('taxDate').get('dateday').setValue(currentDay)
  }
  

  

  ngAfterViewInit(): void{
    // Watch for the blur event from any input element on the form.
    // This is required because the valueChanges does not provide notification on blur
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

    // Merge the blur event observable with the valueChanges observable
    // so we only need to subscribe once.
    merge(this.editForm.valueChanges, ...controlBlurs).pipe(
      debounceTime(800)
    ).subscribe(value => {
      this.displayMessage = this.processMessages(this.editForm);
    });
  }
  
  
  getSalary(id: number): void {
    
    this.salaryService.getSalary(id)
      .subscribe({
        next: (sal: Salary) => this.displaySalary(sal),
        error: err => this.errorMessage = err
      });
  }

  displaySalary(salary: Salary): void {
    if (this.editForm) {
      this.editForm.reset();
    }
    this.salary = salary;

    //title
    if (this.salary.id === 0) {
      this.pageTitle = 'Add Salary';
      //sets currency default to blank if creating new record
      this.salary.currencyCode= '--';
    } else {
      this.pageTitle = `Edit Salary: ${this.salary.companyName}`;
    }
    //tempMonth for single dropdown box of taxMonth
    let tempMonthValue: string;
    if(this.salary.timePeriod=='PM'){
      tempMonthValue = this.salary.taxMonth?.month+'-'+this.salary.taxMonth?.year.substr(2,2)
    }else {
      //for validation
      tempMonthValue = undefined
    }

    // Update the data on the form
    this.editForm.patchValue({
      companyName: this.salary.companyName,
      timePeriod: this.salary.timePeriod,
      salaryAmount: this.salary.salaryAmount,
      currencyCode: this.salary.currencyCode,
      taxYear: {
        year: this.salary.taxYear?.year,
      },
      tempMonth: tempMonthValue,
      taxDate: {
        dateday: this.salary.taxDate?.day,
        datemonth: this.salary.taxDate?.month,
        dateyear: this.salary.taxDate?.year
      }
    });
    this.doTimeVal(this.salary.timePeriod)
  }

  saveSalary(): void {
    this.editForm.patchValue({
    })
    if (this.editForm.valid) {
      if (this.editForm.dirty) {
        //const p: Salary = { ...this.salary, ...this.editForm.value };
        const p: Salary = this.mapSalary();
        if (p.id === 0) {
          this.salaryService.createSalary(p)
            .subscribe({
              next: () => this.onSaveComplete(),
              error: err => this.errorMessage = err
            });
        } else {
          this.salaryService.updateSalary(p)
            .subscribe({
              next: () => this.onSaveComplete(),
              error: err => this.errorMessage = err
            });
        }
      } else {
        this.onSaveComplete();
      }
    } else {
      this.errorMessage = 'Please correct the validation errors.';
    }
  }

  mapSalary(): Salary{

    let tp = this.editForm.get('timePeriod').value

    this.salary.companyName = this.editForm.get('companyName').value
    this.salary.timePeriod = tp;
    this.salary.salaryAmount = this.editForm.get('salaryAmount').value;
    this.salary.currencyCode = this.editForm.get('currencyCode').value
    
    if (tp=='PD') {
      let day: string = this.editForm.get('taxDate').get('dateday').value;
      let month: string = this.editForm.get('taxDate').get('datemonth').value;
      let year: string = this.editForm.get('taxDate').get('dateyear').value;
      this.salary.taxDate = new TaxDate(day,month,year);
      
      this.salary.taxMonth = undefined;
      this.salary.taxYear = undefined;
    }
    if (tp=='PM') {
      let tempMonth: string = this.editForm.get('tempMonth').value;
      let month: string = tempMonth.substr(0,3);
      let year: string = '20'+tempMonth.substr(4,2);
      this.salary.taxMonth = new TaxMonth(month,year)

      this.salary.taxDate = undefined;
      this.salary.taxYear = undefined;
    }
    if (tp=='PY') {
      let year: string = this.editForm.get('taxYear').get('year').value
      this.salary.taxYear = new TaxYear(year)

      this.salary.taxDate = undefined;
      this.salary.taxMonth = undefined;
    }
    return this.salary;
  }

  

  onSaveComplete(): void {
    // Reset the form to clear the flags
    this.editForm.reset();
    this.router.navigate(['/salary']);
  }

  deleteSalary(): void {
    if (this.salary.id === 0) {
      // Don't delete, it was never saved.
      this.onSaveComplete();
    } else {
      if (confirm(`Really delete the salary: ${this.salary.companyName}?`)) {
        this.salaryService.deleteSalary(this.salary.id)
          .subscribe({
            next: () => this.onSaveComplete(),
            error: err => this.errorMessage = err
          });
      }
    }
  }


  processMessages(container: FormGroup): { [key: string]: string } {

    //fix spaces allowed
    let cname: string = this.editForm.get('companyName').value
    this.editForm.get('companyName').setValue(cname.trim())

    const messages:any = {};
    for (const controlKey in container.controls) {
      if (container.controls.hasOwnProperty(controlKey)) {
        const c = container.controls[controlKey];
        // If it is a FormGroup, process its child controls.
        if (c instanceof FormGroup) {
          const childMessages = this.processMessages(c);
          Object.assign(messages, childMessages);
        } else {
          // Only validate if there are validation messages for the control
          if (this.validationMessages[controlKey]) {
            messages[controlKey] = '';
            if ((c.dirty || c.touched) && c.errors) {
              Object.keys(c.errors).map(messageKey => {
                if (this.validationMessages[controlKey][messageKey]) {
                  messages[controlKey] += this.validationMessages[controlKey][messageKey] + ' ';
                }
              });
            }
          }
        }
      }
    }
    console.log(messages)
    return messages;
  }

  getErrorCount(container: FormGroup): number {
    let errorCount = 0;
    for (const controlKey in container.controls) {
      if (container.controls.hasOwnProperty(controlKey)) {
        if (container.controls[controlKey].errors) {
          errorCount += Object.keys(!container.controls[controlKey].errors).length;
          console.log(errorCount);
        }
      }
    }
    return errorCount;
  }

  //set functions for dropdown box dates
  setDayPeriods(): string[][]{
    let allPeriods: string[][];
    let months: string[] = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    let years: string[] = []
    for (let index = 2022; index >= 2010; index--){
      years.push(index.toString());
    }

    let days: string[] = []
    
    for (let index = 31; index > 0; index--) {
      days.push(index.toString())
    }

    allPeriods = [days,months,years]
    return allPeriods;
  }
  
  setMonthPeriods(): string[]{
    let monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    let monthPeriods: string[] = [];
    let year = 22;
    for (let index = 146; index > 0; index--) {
      
      const month = monthNames[index%12];
      if(month=='Dec'){
        year--
      }
      monthPeriods.push('Total for '+month+'-'+year)

    }
    return monthPeriods;
  }
  
  setYearPeriods(): string[]{
    let yearPeriods: string[] = [];
    for (let year = 2022; year > 2010; year--) {
      let prevYear = year-1;
      yearPeriods.push('Total for '+prevYear+'/'+year+ ' Tax Year')

    }
    return yearPeriods;
  }

  doTimeVal(tp: string) {
    
    //Per Day Validation
    if (tp=='PD') {
      this.editForm.get('taxDate')?.get('dateday')?.setValidators([Validators.required])
      this.editForm.get('taxDate')?.get('datemonth')?.setValidators([Validators.required])
      this.editForm.get('taxDate')?.get('dateyear')?.setValidators([Validators.required])
      //this.editForm.get('taxDate')?.updateValueAndValidity();
      
      
      this.editForm.get('tempMonth')?.clearValidators();
      this.editForm.get('tempMonth')?.updateValueAndValidity();

      this.editForm.get('taxYear')?.get('year')?.clearValidators()
      this.editForm.get('taxYear')?.get('year')?.updateValueAndValidity();
    }
    //Per Month Validation
    if (tp=='PM') {
      this.editForm.get('tempMonth').setValidators([Validators.required])
     

      this.editForm.get('taxDate')?.get('dateday')?.clearValidators()
      this.editForm.get('taxDate')?.get('dateday')?.updateValueAndValidity();
      this.editForm.get('taxDate')?.get('datemonth')?.clearValidators()
      this.editForm.get('taxDate')?.get('datemonth')?.updateValueAndValidity();
      this.editForm.get('taxDate')?.get('dateyear')?.clearValidators()
      this.editForm.get('taxDate')?.get('dateyear')?.updateValueAndValidity();

      this.editForm.get('taxYear')?.get('year')?.clearValidators()
      this.editForm.get('taxYear')?.get('year')?.updateValueAndValidity();
    }
    //Per Year Validation
    if (tp=='PY') {
      this.editForm.get('taxYear')?.get('year')?.setValidators([Validators.required])
      //this.editForm.get('taxYear')?.get('year')?.updateValueAndValidity();
      
      this.editForm.get('tempMonth')?.clearValidators();
      this.editForm.get('tempMonth')?.updateValueAndValidity();

      this.editForm.get('taxDate')?.get('dateday')?.clearValidators()
      this.editForm.get('taxDate')?.get('dateday')?.updateValueAndValidity();
      this.editForm.get('taxDate')?.get('datemonth')?.clearValidators()
      this.editForm.get('taxDate')?.get('datemonth')?.updateValueAndValidity();
      this.editForm.get('taxDate')?.get('dateyear')?.clearValidators()
      this.editForm.get('taxDate')?.get('dateyear')?.updateValueAndValidity();
    }




    this.editForm.updateValueAndValidity();
  }
}
