import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InvoiceDataService {
  private patientId!: number;
  private appointmentId!: number;

  setInvoiceData(patientId: number, appointmentId: number): void {
    this.patientId = patientId;
    this.appointmentId = appointmentId;
  }

  getPatientId(): number {
    return this.patientId;
  }

  getAppointmentId(): number {
    return this.appointmentId;
  }
}
