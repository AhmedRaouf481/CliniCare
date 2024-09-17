import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { URLs } from '../shared/api/api-urls';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  
  constructor(private _httpclient: HttpClient) {}
  makeAppt(appointment){
    return this._httpclient.post(`${URLs.ApiBaseUrl+ URLs.appointment}`, appointment);
  }
  getApptBySlotId(slotId: number): Observable<any[]>{
    return this._httpclient.get<any[]>(`${URLs.ApiBaseUrl+ URLs.apptBySlot(slotId)}`);
  }

  getAllAppts():Observable<any>{
    return this._httpclient.get(`${URLs.ApiBaseUrl+ URLs.appointment}`);
  }

  getMyAppts():Observable<any>{
    return this._httpclient.get(`${URLs.ApiBaseUrl+ URLs.myAppointment}`);
  }

  cancelAppt(apptId:number):Observable<any>{
    return this._httpclient.put(`${URLs.ApiBaseUrl+ URLs.appointmentStatus(apptId)}`,{statusId:3});
  }

  getApptTypes():Observable<any>{
    return this._httpclient.get(`${URLs.ApiBaseUrl+ URLs.apptTypes}`);
  }
}
