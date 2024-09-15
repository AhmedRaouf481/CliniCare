import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-appointment-list',
  standalone: true,
  imports: [MatCardModule, MatIconModule,MatButtonModule,CommonModule,],
  templateUrl: './appointment-list.component.html',
  styleUrls: ['./appointment-list.component.css'],
})
export class AppointmentListComponent {
  upcomingAppointments = [
    {
      doctorImage: 'path_to_image.jpg',
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

  pastAppointments = [
    {
      doctorImage: 'path_to_image_3.jpg',
      doctorName: 'Eric Molina',
      doctorTitle: 'dr n. med.',
      clinicName: 'Medica Nova Green',
      clinicLocation: 'Zielona 25/6, Kraków',
      date: '11.08.2022',
      time: '15:20',
      rating: 4,
      comments: 15,
      upcoming: false,
    },
    {
      doctorImage: 'path_to_image_4.jpg',
      doctorName: 'Ernest Padill',
      doctorTitle: 'dr n. med.',
      clinicName: 'Ecomedic',
      clinicLocation: 'Jeziorna 2/6, Kraków',
      date: '08.02.2022',
      time: '15:20',
      rating: 3,
      comments: 8,
      upcoming: false,
    },
  ];
}
