import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Patient } from '../../interfaces/patient';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  private apiUrl = 'http://localhost:8080/api/patient';

  constructor(private http: HttpClient) {}

  getPatientDetails(id: number): Observable<Patient> {
    return this.http.get<Patient>(`${this.apiUrl}/${id}`);
  }

  updatePatientDetails(patient: Patient): Observable<Patient> {
    return this.http.put<Patient>(`${this.apiUrl}/${patient.id}`, patient);
  }
}
