import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {AuthenticationService} from "../../services/auth/authentication.service";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm!: FormGroup
  subs: Subscription[] = [];
  errorMessage!: string;

  constructor(private _authService: AuthenticationService, private _fb: FormBuilder, private _router: Router) {
  }

  ngOnInit(): void {
    this.createLoginForm();
  }

  createLoginForm(): void {
    this.loginForm = this._fb.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    })
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      console.log('Form is invalid');
      this.loginForm.markAllAsTouched();
    }
    console.log(this.loginForm.value)
    const sub = this._authService.login(this.loginForm.value).subscribe({
      next: (res: any) => {
        console.log('logged In ', res);
        const redirectUrl = this._authService.getRedirectUrl();
        this._router.navigate([redirectUrl]);

      },
      error: (error: any) => {
        console.error("login failed", error);
        if(error.status === 400)
        {
          this.errorMessage = error.error.message
        } else {
          this.errorMessage = error.error.message
        }
      }
    });
    this.subs.push(sub);
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
  }


}
