import { Component, OnInit } from '@angular/core';
import { InvoiceService } from '../../services/invoice.service';
import { Invoice } from '../../interfaces/invoice';
import { AuthenticationService } from '../../services/auth/authentication.service';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-invoice-display',
  standalone: true,
  imports: [CommonModule, MatTableModule],
  templateUrl: './invoice-display.component.html',
  styleUrls: ['./invoice-display.component.css']
})
export class InvoiceDisplayComponent implements OnInit {

  invoices: Invoice[] = [];
  displayedColumns: string[] = ['createdAt', 'amount', 'status'];
  patientId: number;

  constructor(
    private invoiceService: InvoiceService,
    private authService: AuthenticationService 
  ) {}

  ngOnInit(): void {
  
  }

  loadInvoices(patientId: number): void {
    this.invoiceService.getInvoicesByPatientId(patientId).subscribe({
      next: (data) => {
        this.invoices = data;
      },
      error: (err) => {
        console.error('Failed to fetch invoices', err);
      }
    });
  }
}
