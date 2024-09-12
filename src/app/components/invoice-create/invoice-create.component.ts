import { Component, OnInit } from '@angular/core';
import { Invoice } from '../../interfaces/invoice';
import { InvoiceService } from '../../services/invoice.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-invoice-create',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule,MatSnackBarModule],
  templateUrl: './invoice-create.component.html',
  styleUrls: ['./invoice-create.component.css']
})
export class InvoiceCreateComponent implements OnInit {
  createForm!: FormGroup;

  constructor(
    private invoiceService: InvoiceService, 
    private router: Router,
    private _formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.createForm = this._formBuilder.group({
      patientId: [0, [Validators.required, Validators.min(1)]],
      appointmentId: [0, [Validators.required, Validators.min(1)]],
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
      duration: 3000, // Duration in milliseconds
      horizontalPosition: 'center', // Position horizontally
      verticalPosition: 'top', // Position vertically
      panelClass: ['snackbar-success'] // Custom class for styling
    });
  }
}
