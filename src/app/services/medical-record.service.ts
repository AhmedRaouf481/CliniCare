import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MedicalRecord } from '../interfaces/medicalRecord';

@Injectable({
  providedIn: 'root'
})
export class MedicalRecordService {

  private baseUrl = 'http://localhost:8080/api/m-record'; 

  constructor(private http: HttpClient) {}

  getMedicalRecordByPatientId(id: number): Observable<MedicalRecord> {
    return this.http.get<MedicalRecord>(`${this.baseUrl}/patient/${id}`);
  }
}
