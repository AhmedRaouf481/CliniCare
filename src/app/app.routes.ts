import {Routes} from '@angular/router';
import {PatientProfileComponent} from './components/patient-profile/patient-profile.component';
import {DoctorComponent} from "./components/doctor/doctor.component";
import {DoctorEditComponent} from "./components/doctor-edit/doctor-edit.component";
import { ScheduleComponent } from './components/schedule/schedule.component';
import { InvoiceCreateComponent } from './components/invoice-create/invoice-create.component';
import { InvoiceDisplayComponent } from './components/invoice-display/invoice-display.component';
import { AppointmentListComponent } from './components/appointment/appointment-list/appointment-list.component';
import { AppointmentComponent } from './components/appointment/appointment.component';

export const routes: Routes = [
  {
    path: 'schedule',
    component: ScheduleComponent,
    title: 'Doctor Schedule'
  },
  {
    path: 'appointment',
    component: AppointmentComponent,
    title: 'Appointments',
    loadChildren: () => import('./components/appointment/appointment.routes').then(m => m.routes)

  },
  {
    path: 'patient/:id',
    component: PatientProfileComponent,
    title: 'Patient Profile'
  },
  {
    path: "doctor/:id",
    component: DoctorComponent,
    title: "Doctor"
  },
  {
    path: "doctor/edit/:id",
    component: DoctorEditComponent,
    title: "Doctor Edit"
  },
  {
    path: 'invoice/create',
    component: InvoiceCreateComponent,
    title: 'Create Invoice'
  },
  {
    path: 'invoice/display',
    component:InvoiceDisplayComponent,
    title:'Display Invoice'
  }
];
