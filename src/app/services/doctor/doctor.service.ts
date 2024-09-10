import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Doctor} from "../../interfaces/doctor";
import {Specialization} from "../../interfaces/Specialization";

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  constructor(private _httpClient: HttpClient) {
  }

  private doctors_api_url = "http://localhost:8080/api/doctors"
  private specs_api_url = "http://localhost:8080/api/specs"
  private doctor_clinics_url = "http://localhost:8080/api/doctor-clinic"

  getDoctor(id:number): Observable<Doctor>
  {
    return this._httpClient.get<Doctor>(`${this.doctors_api_url}/${id}`);
  }

  getAllSpecs(): Observable<Specialization[]>
  {
    return this._httpClient.get<Specialization[]>(`${this.specs_api_url}`)
  }

  updateDoctor(id:number, doctor:Doctor): Observable<Doctor>
  {
    return this._httpClient.put<Doctor>(`${this.doctors_api_url}/${id}`, doctor);
  }

  removeDoctorFromClinic(doctorId:number, clinicId:number): Observable<string>
  {
    return this._httpClient.delete<string>(`${this.doctor_clinics_url}/${doctorId}/${clinicId}`)
  }
}
