import { Component, OnInit } from '@angular/core';
import { Patient } from '../../interfaces/patient';
import { PatientService } from '../../services/patient.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-patient-profile',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './patient-profile.component.html',
  styleUrl: './patient-profile.component.css'
})
export class PatientProfileComponent implements OnInit {
  patient: Patient | undefined;

  constructor(
    private patientService: PatientService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.patientService.getPatientDetails(id).subscribe((data) => {
      this.patient = data;
    });
  }

  savePatientDetails(): void {
    if (this.patient) {
      this.patientService.updatePatientDetails(this.patient).subscribe();
    }
  }
}
