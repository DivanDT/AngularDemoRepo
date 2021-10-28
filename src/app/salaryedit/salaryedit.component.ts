import { AfterViewInit, Component, OnDestroy, OnInit, ViewChildren, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, AbstractControl, FormControlName, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription, fromEvent, merge } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Salary } from '../models/salary.model';
import { TimePeriod } from '../models/time-period.model';
import { SalaryService } from '../salary/salary.service';
import { TimePeriodPipe } from '../pipes/time-period.pipe';
import { typeWithParameters } from '@angular/compiler/src/render3/util';
@Component({
  selector: 'app-salaryedit',
  templateUrl: './salaryedit.component.html',
  styleUrls: ['./salaryedit.component.css']
})
export class SalaryeditComponent implements OnInit, AfterViewInit, OnDestroy {
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
    // These could instead be retrieved from a file or database.
    this.validationMessages = {
      companyName: {
        required: 'Company Name Required',
        minlength: 'Company Name Too Short',
        maxlength: 'Company Name Too Long'
    },
    timePeriod: {
        required: 'Required',
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
    this.dayPeriods = this.setDayPeriods();
    this.monthPeriods = this.setMonthPeriods();
    this.yearPeriods = this.setYearPeriods();
    // Define an instance of the validator for use with this form,
    // passing in this form's set of validation messages.
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
        year: '',
        tempMonth: '',}
      ),
      taxDate: this.fb.group({
        year: '',
        month: '',
        day: ''}
      ),
      salaryAmount: ['',  [Validators.required,
                          Validators.min(0.01),
                          Validators.max(1000000)]],
      currencyCode: ['',Validators.required]
    });


    //Subscribing to parameter
    this.sub = this.route.paramMap.subscribe(
      params => {
        const id = Number(params.get('id'));
        this.getSalary(id);
      }
    );
    
    this.editForm.get("taxMonth")?.get('tempMonth')?.valueChanges.subscribe(x => {
      this.editForm.patchValue({
        taxMonth:{
          month: x?.substr(0,3),
          year: '20'+x?.substr(4,2)
        }
      })
    })
  }

  

  ngOnDestroy(): void{
    this.sub.unsubscribe();
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

  updateSalary(){
    this.editForm.get('companyName')?.valid
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
        tempMonth: this.salary.taxMonth?.month+'-'+this.salary.taxMonth?.year,
        month: this.salary.taxMonth?.month,
        year: this.salary.taxMonth?.year
      },
      taxDate: {
        day: this.salary.taxDate?.day,
        month: this.salary.taxDate?.month,
        year: this.salary.taxDate?.year
      }
    });
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

  setDayPeriods(): string[][]{
    let allPeriods: string[][];
    let days: string[] = []
    for (let index = 31; index > 0; index--) {
      days.push(index.toString())
    }
    
    let months: string[] = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    let years: string[] = []
    for (let index = 2022; index >= 2010; index--){
      years.push(index.toString());
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





}
