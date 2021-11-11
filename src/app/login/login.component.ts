import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { TokenStorageService } from '../_services/token-storage.service';
import {HttpResponse} from "@angular/common/http";
import {Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AlertService} from "../_services/alert.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  fullName = '';
  loading = false;
  submitted = false;

  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              private tokenStorage: TokenStorageService,
              private alertService: AlertService,
              private router: Router) { }

  ngOnInit(): void {

    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.fullName = this.tokenStorage.getUser().firstname +' '+this.tokenStorage.getUser().firstname;
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

    this.authService.login(this.f.username.value, this.f.password.value).subscribe(
      (response: HttpResponse<any>)  => {
        this.tokenStorage.saveToken(''+response.headers.get('Authorization'));
        this.tokenStorage.saveUser(response.body);

        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.fullName = this.tokenStorage.getUser().firstname +' '+this.tokenStorage.getUser().firstname;
        this.router.navigate(['/calculator']);
      },

      err => {
        this.errorMessage = err.error.message;
        this.alertService.error(err.error.message);
        this.isLoginFailed = true;
        this.loading = false;
      }
    );
  }


  reloadPage(): void {
    window.location.reload();
  }
}
