import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Doctor} from "../../interfaces/doctor";
import {Specialization} from "../../interfaces/Specialization";
import {HttpHeaders} from "@angular/common/http";
import {URLs} from "../../shared/api/api-urls";

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  constructor(private _httpClient: HttpClient) {
  }

  private doctors_api_url = "http://localhost:8080/api/doctors"
  private specs_api_url = "http://localhost:8080/api/specs"
  private doctor_clinics_url = "http://localhost:8080/api/doctor-clinic"
  private doctor_profile = URLs.ApiBaseUrl + URLs.profile

  getDoctor(): Observable<Doctor> {
    return this._httpClient.get<Doctor>(this.doctor_profile);
  }

  getAllSpecs(): Observable<Specialization[]> {
    return this._httpClient.get<Specialization[]>(`${this.specs_api_url}`)
  }

  updateDoctor(id: number, doctor: Doctor): Observable<Doctor> {
    return this._httpClient.put<Doctor>(`${this.doctors_api_url}/${id}`, doctor);
  }

  removeDoctorFromClinic(doctorId: number, clinicId: number): Observable<string> {
    return this._httpClient.delete<string>(`${this.doctor_clinics_url}/${doctorId}/${clinicId}`)
  }
}
