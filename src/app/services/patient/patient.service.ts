import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Patient } from '../../interfaces/patient';
import {URLs} from "../../shared/api/api-urls";

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  private patient_profile = URLs.ApiBaseUrl + URLs.profile;
  private patient_update = URLs.ApiBaseUrl + URLs.patient;

  constructor(private http: HttpClient) {}

  getPatientDetails(): Observable<Patient> {
    return this.http.get<Patient>(this.patient_profile);
  }

  updatePatientDetails(patient: Patient): Observable<Patient> {
    console.log(patient)
    return this.http.put<Patient>(`${this.patient_update}/${patient.id}`, patient);
  }
}
