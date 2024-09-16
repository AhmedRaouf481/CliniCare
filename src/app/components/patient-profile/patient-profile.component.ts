import { Component, OnInit } from '@angular/core';
import { Patient } from '../../interfaces/patient';
import { PatientService } from '../../services/patient/patient.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-patient-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule,ReactiveFormsModule],
  templateUrl: './patient-profile.component.html',
  styleUrl: './patient-profile.component.css'
})
export class PatientProfileComponent implements OnInit {
  patient!: Patient | undefined;
  editForm!: FormGroup;

  constructor(
    private patientService: PatientService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private _formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.patientService.getPatientDetails().subscribe((data) => {
      this.patient = data;
      this.populateForm();
    });
    this.createEditForm();
  }
  createEditForm(): void {
    this.editForm = this._formBuilder.group({
        name: ['', [Validators.required, Validators.minLength(3)]],
        username: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(14)]],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', [Validators.required]],
        password: [null, [Validators.minLength(6)]],
        confirmPassword: [null, [Validators.minLength(6)]],
    })
}

  savePatientDetails(): void {
    if (this.patient) {
      console.log(this.patient);
      this.patientService.updatePatientDetails(this.patient).subscribe(() => {
        this.showSuccessMessage(); // Show success message
      });
    }
  }

  private showSuccessMessage(): void {
    this.snackBar.open('Successfully saved!', 'Close', {
      duration: 3000, // Duration in milliseconds
      horizontalPosition: 'center', // Position horizontally
      verticalPosition: 'top', // Position vertically
      panelClass: ['snackbar-success'] // Custom class for styling
    });
  }
  populateForm(): void {
    if (this.patient) {
      this.editForm.patchValue({
        name: this.patient.name,
        username: this.patient.username,
        email: this.patient.email,
        phone: this.patient.phone
      });
    }
  }
}
