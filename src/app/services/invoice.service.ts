import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Invoice } from '../interfaces/invoice';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  private apiUrl = 'http://localhost:8080/api/invoices'; 

  constructor(private http: HttpClient) {}

  getInvoices(): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(`${this.apiUrl}`);
  }

  getInvoiceById(id: number): Observable<Invoice> {
    return this.http.get<Invoice>(`${this.apiUrl}/${id}`);
  }

  createInvoice(invoice: Invoice): Observable<Invoice> {
    return this.http.post<Invoice>(`${this.apiUrl}`, invoice);
  }

  updateInvoice(id: number, invoice: Invoice): Observable<Invoice> {
    return this.http.put<Invoice>(`${this.apiUrl}/${id}`, invoice);
  }

  deleteInvoice(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  getInvoiceByAppointmentId(appointmentId: number): Observable<Invoice> {
    return this.http.get<Invoice>(`${this.apiUrl}/appointment/${appointmentId}`);
  }

  // Get invoices for a specific patient
  getInvoicesByPatientId(patientId: number): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(`${this.apiUrl}/patient/${patientId}`);
  }
}
