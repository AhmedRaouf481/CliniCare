import { Component, Input, OnInit } from '@angular/core';
import { Invoice } from '../../interfaces/invoice';
import { InvoiceService } from '../../services/invoice.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-invoice-create',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatSnackBarModule],
  templateUrl: './invoice-create.component.html',
  styleUrls: ['./invoice-create.component.css']
})
export class InvoiceCreateComponent implements OnInit {
  @Input() patientId!: number;    // Using @Input decorator for patientId
  @Input() appointmentId!: number;  // Using @Input decorator for appointmentId
  createForm!: FormGroup;

  constructor(
    private invoiceService: InvoiceService, 
    private router: Router,
    private _formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    // Initialize the form and set values for patientId and appointmentId from Input properties
    this.createForm = this._formBuilder.group({
      patientId: [this.patientId, [Validators.required, Validators.min(1)]],
      appointmentId: [this.appointmentId, [Validators.required, Validators.min(1)]],
      amount: [0, [Validators.required, Validators.min(1)]],
      status: ['', [Validators.required, Validators.minLength(3)]],
      createdAt: [''],
      updatedAt: ['']
    });
  }

  createInvoice(): void {
    if (this.createForm.valid) {
      const newInvoice: Invoice = this.createForm.value;
      this.invoiceService.createInvoice(newInvoice).subscribe(() => {
        this.showSuccessMessage();
      });
    }
  }

  private showSuccessMessage(): void {
    this.snackBar.open('Successfully saved!', 'Close', {
      duration: 3000, 
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['snackbar-success']
    });
  }
}
