import { Component, Input, OnInit } from '@angular/core';
import { InvoiceService } from '../../services/invoice.service';
import { Invoice } from '../../interfaces/invoice';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';


@Component({
  selector: 'app-invoice-display',
  standalone: true,
  imports: [CommonModule,MatTableModule],
  templateUrl: './invoice-display.component.html',
  styleUrl: './invoice-display.component.css'
})
export class InvoiceDisplayComponent implements OnInit {
  
  patientId=4; 
  invoices: Invoice[] = [];
  displayedColumns: string[] = ['createdAt', 'amount', 'status'];

  constructor(private invoiceService: InvoiceService) {}

  ngOnInit(): void {
    if (this.patientId) {
      this.loadInvoices();
    }
  }

  loadInvoices(): void {
    this.invoiceService.getInvoicesByPatientId(this.patientId).subscribe({
      next: (data) => {
        this.invoices = data;
      },
      error: (err) => {
        console.error('Failed to fetch invoices', err);
      }
    });
  }
}
