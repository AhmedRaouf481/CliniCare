import { Routes } from '@angular/router';
import { BookApptComponent } from './book-appt/book-appt.component';
import { AppointmentListComponent } from './appointment-list/appointment-list.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'list' },
  {
    path: 'book',
    component: BookApptComponent,
    title: 'Appointment | Book',
  },
  {
    path: 'list',
    component: AppointmentListComponent,
    title: 'Appointment | List',
  },
];
