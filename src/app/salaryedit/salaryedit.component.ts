import { AfterViewInit, Component, OnDestroy, OnInit, ViewChildren, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, AbstractControl, FormControlName, FormBuilder } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription, fromEvent, merge } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Salary } from '../models/salary.model';
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
  displayMessage: { [key: string]: string } = {};
  testMessage: string = ' ';
  errorMessage: string;
  currency: string[] = ['ZAR','GBP','USD','CAD','EUR']

  private validationMessages: { [key: string]: { [key: string]: string } };
  
  constructor(private fb: FormBuilder,private route: ActivatedRoute, private salaryService: SalaryService, private router: Router) {
    // Defines all of the validation messages for the form.
    this.validationMessages = {
      companyName: {
        required: 'Company Name Required',
        minlength: 'Company Name Too Short',
        maxlength: 'Company Name Too Long'
    },
    timePeriod: {
        required: 'Time Period Required',
    },
    taxDate: {
      required: 'Day Required'
    },
    tempMonth: {
        required: 'Month Required'
    },
    taxYear: {
      required: 'Year Required'
    },
    salaryAmount: {
        required: 'Salary Required',
        min: 'Below Minimum',
        max: 'Above Maximum'
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
      taxMonth: this.fb.group({
        month: '',
        year: '',}
      ),
      tempMonth: ['',Validators.required],
      taxDate: this.fb.group({
        year: '',
        month: '',
        day: ''}
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

   
    //set month and day from 1 dropdown
    this.editForm.get('tempMonth')?.valueChanges.subscribe(x => {
      this.editForm.patchValue({
        taxMonth:{
          month: x?.substr(0,3),
          year: '20'+x?.substr(4,2)
        }
      })
    })

    //sets correct number of days for each month
    this.editForm.get('taxDate')?.get('month').valueChanges.subscribe(x => {
      this.setDaysInMonth(this.editForm.get('taxDate')?.get('year').value,x);
    })
    
  }
  setDaysInMonth(year: string, month: string){
    if(year==undefined){
      //fixes day cannot be chosen if year is not chosen
      year = '2021'
    }
    //use currentDay so date is not lost
    let currentDay = this.editForm.get('taxDate').get('day').value
    //get month index from month name
    let monthNum = this.dayPeriods[1].findIndex(x => x == month)
    //get number of days in specific month using getDate()
    let numDays = new Date(parseInt(year),monthNum+1,0).getDate();
    let days: string[] = []
    for (numDays; numDays > 0; numDays--) {
      days.push(numDays.toString())
    }
    this.dayPeriods[0] = days
    this.editForm.get('taxDate').get('day').setValue(currentDay)
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
    

    if (this.salary.id === 0) {
      this.pageTitle = 'Add Salary';
    } else {
      this.pageTitle = `Edit Salary: ${this.salary.companyName}`;
    }
    let tempMonthValue: string;

    //tempMonth for single dropdown box of taxMonth
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
      taxMonth: {
        month: this.salary.taxMonth?.month,
        year: this.salary.taxMonth?.year
      },
      tempMonth: tempMonthValue,
      taxDate: {
        day: this.salary.taxDate?.day,
        month: this.salary.taxDate?.month,
        year: this.salary.taxDate?.year
      }
    });
    
    this.doTimeVal(this.salary.timePeriod)
  }

  saveSalary(): void {
    this.editForm.patchValue({
    })
    if (this.editForm.valid) {
      if (this.editForm.dirty) {
        const p = { ...this.salary, ...this.editForm.value };
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
      this.editForm.get('taxDate')?.get('day')?.setValidators([Validators.required])
      this.editForm.get('taxDate')?.get('month')?.setValidators([Validators.required])
      this.editForm.get('taxDate')?.get('year')?.setValidators([Validators.required])
      this.editForm.get('taxDate')?.updateValueAndValidity();
      
      
      this.editForm.get('tempMonth')?.clearValidators();
      this.editForm.get('tempMonth')?.updateValueAndValidity();

      this.editForm.get('taxYear')?.get('year')?.clearValidators();
      this.editForm.get('taxYear')?.get('year')?.updateValueAndValidity();
    }
    //Per Month Validation
    if (tp=='PM') {
      this.editForm.get('tempMonth').setValidators([Validators.required])
     

      this.editForm.get('taxDate')?.get('day')?.clearValidators()
      this.editForm.get('taxDate')?.get('day')?.updateValueAndValidity();
      this.editForm.get('taxDate')?.get('month')?.clearValidators()
      this.editForm.get('taxDate')?.get('month')?.updateValueAndValidity();
      this.editForm.get('taxDate')?.get('year')?.clearValidators()
      this.editForm.get('taxDate')?.get('year')?.updateValueAndValidity();

      this.editForm.get('taxYear')?.get('year')?.clearValidators()
      this.editForm.get('taxYear')?.get('year')?.updateValueAndValidity();
    }
    //Per Day Validation
    if (tp=='PY') {
      this.editForm.get('taxYear')?.get('year')?.setValidators([Validators.required])
      this.editForm.get('taxYear')?.updateValueAndValidity();
      
      this.editForm.get('tempMonth')?.clearValidators();
      this.editForm.get('tempMonth')?.updateValueAndValidity();

      this.editForm.get('taxDate')?.get('day')?.clearValidators()
      this.editForm.get('taxDate')?.get('day')?.updateValueAndValidity();
      this.editForm.get('taxDate')?.get('month')?.clearValidators()
      this.editForm.get('taxDate')?.get('month')?.updateValueAndValidity();
      this.editForm.get('taxDate')?.get('year')?.clearValidators()
      this.editForm.get('taxDate')?.get('year')?.updateValueAndValidity();
    }




    this.editForm.updateValueAndValidity();
  }
}
