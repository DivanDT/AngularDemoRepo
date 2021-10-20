import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap, map} from 'rxjs/operators';
import { Salary } from '../models/salary.model';
import { TimePeriod } from '../models/time-period.model';

@Injectable({
  providedIn: 'root'
})

export class SalaryService {

  constructor(private http: HttpClient) { }
  private salaryUrl = 'api/Salaries/'

  
  getSalaries(): Observable<Salary[]> {
    return this.http.get<Salary[]>(this.salaryUrl)
      .pipe(
        tap(data => console.log(JSON.stringify(data))),
        catchError(this.handleError)
      );
  }
  
  getSalary(id: number): Observable<Salary> {
    if (id === 0) {
      return of(this.initializeEmptySalary())
    }
    const url = `${this.salaryUrl}/${id}`;
    return this.http.get<Salary>(url)
      .pipe(
        tap(data => console.log('getSalary: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  createSalary(salary: Salary): Observable<Salary> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    salary.id = 0;
    return this.http.post<Salary>(this.salaryUrl, salary, { headers })
      .pipe(
        tap(data => console.log('createSalary: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  deleteSalary(id: number): Observable<{}> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.salaryUrl}/${id}`;
    return this.http.delete<Salary>(url, { headers })
      .pipe(
        tap(data => console.log('deleteSalary: ' + id)),
        catchError(this.handleError)
      );
  }

  updateProduct(salary: Salary): Observable<Salary> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.salaryUrl}/${salary.id}`;
    return this.http.put<Salary>(url, salary, { headers })
      .pipe(
        tap(() => console.log('updateProduct: ' + salary.id)),
        // Return the product on an update
        map(() => salary),
        catchError(this.handleError)
      );
  }



  
  private handleError(err: any) {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;
    }
    console.error(err);
    return throwError(errorMessage);
  }

  private initializeEmptySalary(): Salary{
    return {id: 0,
            userId: 0,
            companyName: '',
            timePeriod: TimePeriod.PerDay,
            salaryAmount: 0,
            currencyCode: 'ZAR',
            showDetails: false
          };
  }
}
