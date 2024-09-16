import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { AppointmentService } from '../../../services/appointment.service';
import { SlotDurationPipe } from '../../../shared/pipes/slot-duration.pipe';

@Component({
  selector: 'app-appointment-list',
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    CommonModule,
    SlotDurationPipe,
  ],
  templateUrl: './appointment-list.component.html',
  styleUrls: ['./appointment-list.component.css'],
})
export class AppointmentListComponent implements OnInit {
  /**
   *
   */
  constructor(private _apptService: AppointmentService) {}
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
      const docAppts = res.doctor
      const patientAppts = res.patient

      patientAppts.forEach((appt) => {
        const appointmentDate = new Date(appt.date);

        const appointmentDetails = {
          doctorName: appt.slot.doctor.name,
          clinicName: appt.slot.clinicLocation.clinic.name,
          clinicLocation: `${appt.slot.clinicLocation.addressLine}, ${appt.slot.clinicLocation.city}`,
          date: appt.date,
          time: appt.slot.startTime,
          rating: 4,
          comments: 305,
        };

        if (appointmentDate >= currentDate) {
          // Upcoming appointment
          this.upcomingAppointments.push(appointmentDetails);
        } else {
          // Past appointment
          this.pastAppointments.push(appointmentDetails);
        }
      });

      console.log('Upcoming:', this.upcomingAppointments);
      console.log('Past:', this.pastAppointments);
    });
  }
}
