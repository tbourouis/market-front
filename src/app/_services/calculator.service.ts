import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";


const AUTH_API = 'http://localhost:8092/tools/converter/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class CalculatorService {

  constructor(private http: HttpClient) { }
  login(amount: number, currency: string): Observable<any> {
    return this.http.get(AUTH_API + 'amount?amount='+amount+'&base=EUR&target='+currency
      , httpOptions);
  }
}
