import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MedicalRecord } from '../../interfaces/medicalRecord';
import { MedicalRecordService } from '../../services/medical-record.service';
import { CommonModule } from '@angular/common';
import { AuthenticationService } from '../../services/auth/authentication.service';

@Component({
  selector: 'app-medical-record',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './medical-record.component.html',
  styleUrls: ['./medical-record.component.css']
})
export class MedicalRecordComponent implements OnInit {
  medicalRecord!: MedicalRecord;

  constructor(
    private medicalRecordService: MedicalRecordService,
    private route: ActivatedRoute,
    private authService: AuthenticationService
  ) {}

  ngOnInit(): void {
    const patientId = this.authService.getCurrentUser()?.id;

    if (patientId !== undefined) {
      this.medicalRecordService.getMedicalRecordByPatientId(patientId).subscribe(
        (record) => {
          this.medicalRecord = record;
        },
        (error) => {
          console.error('Error fetching medical record:', error);
        }
      );
    } else {
      console.error('Patient ID is undefined');
      
    }
  }
}
