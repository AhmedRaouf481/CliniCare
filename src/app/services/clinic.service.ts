import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URLs } from '../shared/api/api-urls';
import { Observable } from 'rxjs';
import { Clinic } from '../interfaces/clinic';

@Injectable({
  providedIn: 'root'
})
export class ClinicService {

  constructor(private _httpclient: HttpClient) { }

  getMyClinics():Observable<Clinic[]>{
    return this._httpclient.get<Clinic[]>(`${URLs.ApiBaseUrl+ URLs.myClinics}`);
  }

  getClinicByDoctorId(doctorId: number):Observable<Clinic[]>{
    return this._httpclient.get<Clinic[]>(`${URLs.ApiBaseUrl+ URLs.doctorClinics(doctorId)}`);
  }

  getAllClinics():Observable<Clinic[]>{
    return this._httpclient.get<Clinic[]>(`${URLs.ApiBaseUrl+ URLs.clinic}`);
  }
}
