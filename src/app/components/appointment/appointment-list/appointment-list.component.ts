import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { AppointmentService } from '../../../services/appointment.service';
import { SlotDurationPipe } from '../../../shared/pipes/slot-duration.pipe';
import { AuthenticationService } from '../../../services/auth/authentication.service';
import { RouterLink } from '@angular/router';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppointmentCardComponent } from "./appointment-card/appointment-card.component";

@Component({
  selector: 'app-appointment-list',
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    CommonModule,
    SlotDurationPipe,
    RouterLink,
    MatButtonToggleModule,
    FormsModule,
    ReactiveFormsModule,
    AppointmentCardComponent
],
  templateUrl: './appointment-list.component.html',
  styleUrls: ['./appointment-list.component.css'],
})
export class AppointmentListComponent implements OnInit {
  appointmentViewControl = new FormControl('Upcoming');
  currentRole: string;

  openCancelDialog(appointment: any): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent);

    // After the dialog is closed
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Logic to cancel the appointment
        this.cancelAppointment(appointment);
      }
    });
  }

  cancelAppointment(appointment: any): void {
    // Implement your logic to cancel the appointment here
    console.log('Appointment cancelled:', appointment);
    this._apptService.cancelAppt(appointment.id).subscribe({
      error: (err: any) => {
        console.error('error canceling appointment', err);
        this.showFeedbackMessage(err.error.message, 'error-snackbar')
      },
      complete: () => {
        this.showFeedbackMessage(
          'Appointment canceled successfully',
          'success-snackbar'
        );
        this.fetchAppts()
      },
    })
    
  }
  constructor(
    private _apptService: AppointmentService,
    private authService: AuthenticationService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,

  ) {
    this.currentRole = localStorage.getItem('currentRole');
  }
  ngOnInit(): void {
    this.fetchAppts();
    console.log(this.appointmentViewControl.value);
  }
  upcomingAppointments = [];
  todayAppointments = [];
  pastAppointments = [];

  fetchAppts() {
    this._apptService.getMyAppts().subscribe((res) => {
      const currentDate = new Date();
      const docAppts = res.doctor;
      const patientAppts = res.patient;
      const upcomingAppointments = [];
      const todayAppointments = [];
      const pastAppointments = [];
      if (this.currentRole === 'doctor') {
        docAppts.forEach((appt) => {
          const appointmentDate = new Date(appt.date);
       
          const appointmentDetails = {
            id:appt.id,
            personTitle: 'Patient name: ',
            personName: appt.patientName,
            clinicName: appt.clinicName,
            clinicLocation: `${appt.locationAddressLine}, ${appt.locationCity}`,
            date: appt.date,
            time: appt.slotStartTime,
          };
          
          const currentDateOnly = new Date(currentDate.setHours(0, 0, 0, 0));
          const appointmentDateOnly = new Date(appointmentDate.setHours(0, 0, 0, 0));
          if (appointmentDateOnly.getTime() > currentDateOnly.getTime()) {
            // Upcoming appointment
            upcomingAppointments.push(appointmentDetails);
          } else if (appointmentDateOnly.getTime() === currentDateOnly.getTime()) {
            // Past appointment
            todayAppointments.push(appointmentDetails);
          } else {
            // Past appointment
            pastAppointments.push(appointmentDetails);
          }
        });
      } else {
        patientAppts.forEach((appt) => {
          const appointmentDate = new Date(appt.date);

          const appointmentDetails = {
            id:appt.id,
            personTitle: 'Doctor name: ',
            personName: appt.doctorName,
            clinicName: appt.clinicName,
            clinicLocation: `${appt.locationAddressLine}, ${appt.locationCity}`,
            date: appt.date,
            time: appt.slotStartTime,
          };

          if (appointmentDate >= currentDate) {
            // Upcoming appointment
            upcomingAppointments.push(appointmentDetails);
          } else {
            // Past appointment
            pastAppointments.push(appointmentDetails);
          }
        });
      }
      this.upcomingAppointments = upcomingAppointments;
      this.todayAppointments = todayAppointments;
      this.pastAppointments = pastAppointments;

      console.log('Upcoming:', this.upcomingAppointments);
      console.log('Past:', this.pastAppointments);
    });
  }
  cancelAppt(){

  }
  
  private showFeedbackMessage(msg: string, style: string): void {
    this.snackBar.open(msg, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: style,
    });
  }
}
