import { Component, OnInit } from '@angular/core';
import { Patient } from '../../interfaces/patient';
import { PatientService } from '../../services/patient/patient.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-patient-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  templateUrl: './patient-profile.component.html',
  styleUrl: './patient-profile.component.css'
})
export class PatientProfileComponent implements OnInit {
  patient: Patient | undefined;

  constructor(
    private patientService: PatientService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar // Inject MatSnackBar here
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.patientService.getPatientDetails(id).subscribe((data) => {
      this.patient = data;
    });
  }

  savePatientDetails(): void {
    if (this.patient) {
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
}
