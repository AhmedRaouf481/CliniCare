import { Component, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Slot } from '../../../../interfaces/slot.interface';
import { AppointmentService } from '../../../../services/appointment.service';
import { CapitalizeFirstPipe } from '../../../../shared/pipes/capitalize-first.pipe';
import { SlotDurationPipe } from '../../../../shared/pipes/slot-duration.pipe';
import { AuthenticationService } from '../../../../services/auth/authentication.service';

@Component({
  selector: 'app-slot-card',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
    SlotDurationPipe,
    CapitalizeFirstPipe,
    CommonModule,
  ],
  templateUrl: './slot-card.component.html',
  styleUrl: './slot-card.component.css',
})
export class SlotCardComponent implements OnInit {
  @Input() slot!: Slot;
  apptForm!: FormGroup;
  appts: any[] = [];
  apptTypes: any[] = [];
  patientId:number

  constructor(
    private _apptService: AppointmentService,
    private _authService: AuthenticationService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
  ) {
    this.patientId = _authService.getUserId()
  }
  ngOnInit(): void {
    this.initApptForm();
    this.fetchApptsBySlotId(this.slot.id);
    this.fetchApptTypes();
  }
  initApptForm() {
    this.apptForm = this.fb.group({
      type: ['', Validators.required],
      date: ['', Validators.required],
    });
  }

  fetchApptsBySlotId(slotId: number) {
    this._apptService.getApptBySlotId(slotId).subscribe({
      next: (appts) => {
        this.appts = appts; // Store the appointments
        console.log(appts);
      },
    });
  }
  fetchApptTypes() {
    this._apptService.getApptTypes().subscribe({
      next: (apptTypes) => {
        this.apptTypes = apptTypes; // Store the appointments
      },
    });
  }
  myFilter = (d: Date | null): boolean => {
    if (!d) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of the day for accurate comparison
    if (d < today) return false;

    const slotWeekDay = this.getSlotWeekDay();
    const dayOfWeek = d.getDay();

    // Disable dates that are not on the slot's weekday
    if (dayOfWeek !== slotWeekDay) {
      return false;
    }

    // Check if the day is already booked
    const isBooked = this.appts.some(
      (appt) => new Date(appt.date).toDateString() === d.toDateString()
    );

    // Disable the date if it's booked
    return !isBooked;
  };

  getSlotWeekDay(): number {
    const weekDayMap = {
      SUNDAY: 0,
      MONDAY: 1,
      TUESDAY: 2,
      WEDNESDAY: 3,
      THURSDAY: 4,
      FRIDAY: 5,
      SATURDAY: 6,
    };

    return weekDayMap[this.slot.weekDay];
  }
  formatDate(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based, so add 1
    const day = date.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
  submitAppt() {
    if (this.apptForm.invalid) {
      this.apptForm.markAllAsTouched();
      return;
    }
    const appt = {
      patient: {
        id: this.patientId,
      },
      slot: {
        id: this.slot.id,
      },
      date: this.formatDate(this.apptForm.value.date),
      type: this.apptForm.value.type,
    };

    this._apptService.makeAppt(appt).subscribe({
      next: (res) => {
        console.log('Appointment made successfully', res);
      },
      error: (err: any) => {
        console.error('error making appointment', err);
        this.showFeedbackMessage(err.error.message, 'error-snackbar')
      },
      complete: () => {
        this.showFeedbackMessage(
          'Appointment bookeed successfully',
          'success-snackbar'
        );
        this.apptForm.reset();
        this.fetchApptsBySlotId(this.slot.id);
      },
    });
  }
  // Show feedback messages
  private showFeedbackMessage(msg: string, style: string): void {
    this.snackBar.open(msg, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: style,
    });
  }
}
