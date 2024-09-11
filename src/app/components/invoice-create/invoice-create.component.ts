import { Component } from '@angular/core';
import { Invoice } from '../../interfaces/invoice';
import { InvoiceService } from '../../services/invoice.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-invoice-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './invoice-create.component.html',
  styleUrl: './invoice-create.component.css'
})
export class InvoiceCreateComponent {
  invoice: Invoice = {
    patientId: 0,
    appointmentId: 0,
    amount: 0,
    status: '',
    createdAt: '',
    updatedAt: ''
  };

  constructor(private invoiceService: InvoiceService, private router: Router) { }

  createInvoice(): void {
    this.invoiceService.createInvoice(this.invoice).subscribe(() => {
      this.router.navigate(['/invoices']);
    });
  }

}
