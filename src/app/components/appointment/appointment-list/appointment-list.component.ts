import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { AppointmentService } from '../../../services/appointment.service';
import { SlotDurationPipe } from '../../../shared/pipes/slot-duration.pipe';
import { AuthenticationService } from '../../../services/auth/authentication.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-appointment-list',
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    CommonModule,
    SlotDurationPipe,
    RouterLink
  ],
  templateUrl: './appointment-list.component.html',
  styleUrls: ['./appointment-list.component.css'],
})
export class AppointmentListComponent implements OnInit {
  /**
   *
   */
  currentRole: string;
  constructor(
    private _apptService: AppointmentService,
    private authService: AuthenticationService
  ) {
    this.currentRole = localStorage.getItem('currentRole');
  }
  ngOnInit(): void {
    this.fetchAppts();
  }
  upcomingAppointments = [];

  upcomingAppointmentss = [
    {
      doctorName: 'Magdalena Ignis',
      doctorTitle: 'dr n. med.',
      clinicName: 'Atmeris Medica',
      clinicLocation: 'Wawelska 25/6, Kraków',
      date: '15.08.2023',
      time: '10:00',
      rating: 4,
      comments: 305,
      upcoming: true,
    },
    {
      doctorImage: 'path_to_image_2.jpg',
      doctorName: 'Stefan Tracki',
      doctorTitle: 'lek.',
      clinicName: 'Mediceu',
      clinicLocation: 'Sarego 22, Kraków',
      date: '20.08.2023',
      time: '15:20',
      rating: 4,
      comments: 12,
      upcoming: true,
    },
  ];
  pastAppointments = [];

  fetchAppts() {
    this._apptService.getMyAppts().subscribe((res) => {
      const currentDate = new Date();
      const docAppts = res.doctor;
      const patientAppts = res.patient;
      if (this.currentRole === 'doctor') {
        docAppts.forEach((appt) => {
          const appointmentDate = new Date(appt.date);

          const appointmentDetails = {
            doctorName: appt.doctorName,
            clinicName: appt.clinicName,
            clinicLocation: `${appt.locationAddressLine}, ${appt.locationCity}`,
            date: appt.date,
            time: appt.slotStartTime,
            rating: 4,  // Assuming this is static or calculated elsewhere
            comments: 305  // Assuming this is static or calculated elsewhere
          };
          

          if (appointmentDate >= currentDate) {
            // Upcoming appointment
            this.upcomingAppointments.push(appointmentDetails);
          } else {
            // Past appointment
            this.pastAppointments.push(appointmentDetails);
          }
        });
      } else  {
        patientAppts.forEach((appt) => {
          const appointmentDate = new Date(appt.date);

          const appointmentDetails = {
            doctorName: appt.doctorName,
            clinicName: appt.clinicName,
            clinicLocation: `${appt.locationAddressLine}, ${appt.locationCity}`,
            date: appt.date,
            time: appt.slotStartTime,
            rating: 4,  // Assuming this is static or calculated elsewhere
            comments: 305  // Assuming this is static or calculated elsewhere
          };

          if (appointmentDate >= currentDate) {
            // Upcoming appointment
            this.upcomingAppointments.push(appointmentDetails);
          } else {
            // Past appointment
            this.pastAppointments.push(appointmentDetails);
          }
        });
      }

      console.log('Upcoming:', this.upcomingAppointments);
      console.log('Past:', this.pastAppointments);
    });
  }
}
