import { Component, OnInit } from '@angular/core';
import {TokenStorageService} from "../_services/token-storage.service";
import {CalculatorService} from "../_services/calculator.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AlertService} from "../_services/alert.service";

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.css']
})
export class CalculatorComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  submitted = false;
  isLoggedIn = false;
  isCalculError = false;
  errorMessage = '';
  result = 0;

  constructor(private formBuilder: FormBuilder,
              private alertService: AlertService,
              private calculatorService: CalculatorService,
              private tokenStorage: TokenStorageService) { }

  ngOnInit(): void {
    const currencyValidators = [Validators.minLength(3)];
    currencyValidators.push(Validators.required);

    this.form = this.formBuilder.group({
      amount: ['', Validators.required],
      currency: ['', currencyValidators]
    });
    if (this.tokenStorage.getToken()) {
    this.isLoggedIn = true;
  }
}
  get f() { return this.form.controls; }
  onSubmit(): void {
    this.submitted = true;
    this.alertService.clear();
    if (this.form.invalid) {
      return;
    }
    this.loading = true;
    this.calculatorService.login(this.f.amount.value, this.f.currency.value).subscribe(
      data => {
        this.result = data.amount;
      },
      err => {
        console.log("ERROR "+JSON.stringify(err.error.errorMessage));
        this.alertService.error(err.error.errorMessage);
        this.errorMessage = err.error.errorMessage;
        this.isCalculError = true;
        this.result = 0;
      }
    );
  }

}
