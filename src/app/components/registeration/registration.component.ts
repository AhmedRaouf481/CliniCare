import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Specialization} from "../../interfaces/Specialization";
import {Subscription} from "rxjs";
import {DoctorService} from "../../services/doctor/doctor.service";
import {animate, style, transition, trigger} from "@angular/animations";
import {AuthenticationService} from "../../services/auth/authentication.service";

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule
  ],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css',
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({height: 0, opacity: 0}),
        animate('300ms ease-out', style({height: '*', opacity: 1}))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({height: 0, opacity: 0}))
      ])
    ])
  ]
})
export class RegistrationComponent implements OnInit, OnDestroy {

  specializations: Specialization[] = [];
  registerForm!: FormGroup;
  subs: Subscription[] = [];
  errorMessage!: string;

  constructor(private _doctorService: DoctorService,
              private _fb: FormBuilder, private _router: Router,
              private _authService: AuthenticationService
  ) {
    this.loadSpecs();
  }

  ngOnInit(): void {
    this.createRegisterForm();

    this.handleDoctorFieldsValidation(this.isDoctor.value);

    this.isDoctor.valueChanges.subscribe(value => {
      this.handleDoctorFieldsValidation(value);
    });

  }

  loadSpecs(): void {
    const sub = this._doctorService.getAllSpecs().subscribe({
      next: (res: Specialization[]) => {
        this.specializations = res;
      }, error(err: any) {
        console.log("error fetching specializations \n", err.message)
      }
    });
    this.subs.push(sub);
  }

  createRegisterForm(): void {
    this.registerForm = this._fb.group({
      name: ['', Validators.required],
      username: ['', Validators.required],
      phone: ['', [Validators.required, Validators.minLength(11)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      passwordConfirm: ['', Validators.required],
      isDoctor: [false],
      summary: [''],
      salary: [0],
      specialization: [''],
      roles: this._fb.array([
        {
          "id": 3,
          "name": "PATIENT"
        }
      ])
    });

  }

  get isDoctor(): FormControl {
    return this.registerForm.get('isDoctor') as FormControl;
  }

  toggleDoctorRegistration() {
    this.isDoctor.setValue(!this.isDoctor.value);
  }
  handleDoctorFieldsValidation(isDoctor: boolean) {
    const doctorFields = ['summary', 'salary', 'specialization'];

    doctorFields.forEach(field => {
      const control = this.registerForm.get(field);
      if (isDoctor) {
        control?.setValidators([Validators.required]);
        control?.enable();
      } else {
        control?.clearValidators();
        control?.disable();
        control?.setValue(null);
      }
      control?.updateValueAndValidity();
    });
  }


  onSubmit(): void {
    if (this.isDoctor.value) {
      const rolesArray = this.registerForm.get('roles') as FormArray;
      if (!rolesArray.value.some((role: any) => role.name === "DOCTOR")) {
        rolesArray.push(this._fb.group({
          id: 2,
          name: "DOCTOR"
        }));
      }
    }

    if (this.registerForm.valid) {
      console.log(this.registerForm.value);
    const sub = this._authService.register(this.registerForm.value).subscribe({
      next: (res: any) => {
        console.log('user have been registered successfully', res);
        this._router.navigate(['/home']);
      }, error: (error: any) => {
        console.error('error registering User', error);
        this.errorMessage = "this username or Email are taken, try other values";
      }
    })
      this.subs.push(sub);
    } else {
      console.log('Form is invalid');
      this.registerForm.markAllAsTouched();
    }
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe())
  }

}
