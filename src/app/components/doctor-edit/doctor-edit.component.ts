import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {DoctorService} from "../../services/doctor/doctor.service";
import {Router} from "@angular/router";
import {Doctor} from "../../interfaces/doctor";
import {ReactiveFormsModule, FormGroup, FormBuilder, Validators, FormArray} from "@angular/forms";
import {Specialization} from "../../interfaces/Specialization";
import {NgForOf, NgIf} from "@angular/common";
import {AuthenticationService} from "../../services/auth/authentication.service";

@Component({
  selector: 'app-doctor-edit',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgForOf,
    NgIf
  ],
  templateUrl: './doctor-edit.component.html',
  styleUrl: './doctor-edit.component.css'
})
export class DoctorEditComponent implements OnInit, OnDestroy {

  doctor!: Doctor;
  specializations: Specialization[] = [];
  editForm!: FormGroup;
  subs: Subscription[] = [];

  constructor(private _doctorService: DoctorService, private _router: Router,
              private _auth: AuthenticationService, private _formBuilder: FormBuilder) {

    this.loadSpecs();
  }

  ngOnInit(): void {

    this.loadDoctor();
    this.createEditForm();

  }

  createEditForm(): void {
    this.editForm = this._formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      username: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(14)]],
      email: ['', [Validators.required, Validators.email]],
      password: [null, [Validators.minLength(6)]],
      confirmPassword: [null, [Validators.minLength(6)]],
      summary: ['', [Validators.required]],
      salary: ['', [Validators.required]],
      specialization: [null, [Validators.required, Validators.minLength(1)]],
      doctorClinics: this._formBuilder.array([]),
      phone: ['', [Validators.required]]
    })
  }

  get doctorClinics(): FormArray {
    return this.editForm.get('doctorClinics') as FormArray;
  }


  addClinic(clinic: any): void {
    const clinicForm = this._formBuilder.group({
      name: [clinic.name, Validators.required],
      id: [clinic.id],
    });
    this.doctorClinics.push(clinicForm);
  }


  removeDoctorClinic(clinicId: number): void {
    console.log('Removing clinic with ID:', clinicId);

    // Call the service to delete the clinic from the database
    const sub = this._doctorService.removeDoctorFromClinic(this.doctor.id, clinicId).subscribe({
      next: () => {
        // After successfully deleting from the database, remove it from the FormArray
        const index = this.doctorClinics.controls.findIndex(
          clinic => clinic.get('id')?.value === clinicId
        );
        if (index > -1) {
          this.doctorClinics.removeAt(index);  // Remove the clinic from the form array
        } else {
          console.error('Clinic not found in the FormArray');
        }
      },
      error: (err) => {
        console.error('Error removing clinic from the database:', err);
      }
    });
    this.subs.push(sub);
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

  loadDoctor(): void {
    const sub = this._doctorService.getDoctor().subscribe({
      next: (res: Doctor) => {
        this.doctor = res;
        this.editForm.patchValue({
          name: res.name,
          username: res.username,
          email: res.email,
          summary: res.summary,
          salary: res.salary,
          specialization: res.specialization.id,
          phone: res.phone
        });
        const specialization = this.specializations.find(spec => spec.id === res.specialization?.id);
        this.editForm.patchValue({
          specialization: specialization
        });
        this.doctorClinics.clear();
        res.doctorClinics.forEach(clinic => this.addClinic(clinic));
        console.log(this.editForm)
      }, error(err: any) {
        console.log("error fetching doctor \n", err.message)
      }
    })
    this.subs.push(sub);
  }


  submitUpdate(): void {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
    }

    console.log(this.editForm.value);
    const sub = this._doctorService.updateDoctor(this.doctor.id, this.editForm.value).subscribe({
      next: (res: any) => {
        console.log('Doctor updated successfully', res);
        this._router.navigate(['/doctor/profile'])
      }, error: (err: any) => {
        console.error('error updating doctor', err);
      }
    });
    this.subs.push(sub);
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
  }


}
