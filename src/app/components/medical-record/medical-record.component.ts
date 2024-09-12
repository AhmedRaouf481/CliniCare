import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MedicalRecord } from '../../interfaces/medicalRecord';
import { MedicalRecordService } from '../../services/medical-record.service';
import { CommonModule } from '@angular/common';

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
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const patientId = this.route.snapshot.params['id'];
    this.medicalRecordService.getMedicalRecordByPatientId(patientId).subscribe(
      (record) => {
        this.medicalRecord = record;
      }
    );
  }
}
