import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Doctor} from "../../interfaces/doctor";

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  constructor(private _httpClient: HttpClient) {
  }

  private api_url = "http://localhost:8080/api/doctors"

  getDoctor(id:number): Observable<Doctor>
  {
    return this._httpClient.get<Doctor>(`${this.api_url}/${id}`);
  }

  updateDoctor(doctor:Doctor): Observable<Doctor>
  {
    return this._httpClient.put<Doctor>(`${this.api_url}/${doctor.id}`, doctor);
  }
}
