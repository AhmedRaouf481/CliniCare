import {Routes} from '@angular/router';
import {PatientProfileComponent} from './components/patient-profile/patient-profile.component';
import {DoctorComponent} from "./components/doctor/doctor.component";
import {DoctorEditComponent} from "./components/doctor-edit/doctor-edit.component";
import { AppointmentComponent } from './components/appointment/appointment.component';
import {ScheduleComponent} from './components/schedule/schedule.component';
import {InvoiceCreateComponent} from './components/invoice-create/invoice-create.component';
import {InvoiceDisplayComponent} from './components/invoice-display/invoice-display.component';
import {RegistrationComponent} from "./components/registeration/registration.component";
import {LoginComponent} from "./components/login/login.component";
import {UnauthorizedComponent} from "./components/errors/unauthorized/unauthorized.component";
import {NotFoundComponent} from "./components/errors/not-found/not-found.component";
import {activeUserGuard} from "./guards/active-user/active-user.guard";
import {HomeComponent} from "./components/home/home.component";
import { MedicalRecordComponent } from './components/medical-record/medical-record.component';

export const routes: Routes = [

  {
    path: "",
    redirectTo: "home",
    pathMatch: "full"
  },
  {
    path: "home",
    component: HomeComponent,
    title: "home",
    canActivate: [activeUserGuard]
  },
  {
    path: 'schedule',
    component: ScheduleComponent,
    title: 'Doctor Schedule',
    canActivate: [activeUserGuard]
  },
  {
    path: 'appointment',
    component: AppointmentComponent,
    title: 'Appointments',
    loadChildren: () => import('./components/appointment/appointment.routes').then(m => m.routes),
    canActivate: [activeUserGuard]


  },
  {
    path: 'patient/:id',
    component: PatientProfileComponent,
    title: 'Patient Profile',
    canActivate: [activeUserGuard]

  },
  {
    path: "doctor/profile",
    component: DoctorComponent,
    title: "Doctor",
    canActivate: [activeUserGuard]

  },
  {
    path: "doctor/edit/profile",
    component: DoctorEditComponent,
    title: "Doctor Edit",
    canActivate: [activeUserGuard]

  },
  {
    path: 'invoice/create',
    component: InvoiceCreateComponent,
    title: 'Create Invoice',
    canActivate: [activeUserGuard]

  },
  {
    path: 'invoice/display',
    component: InvoiceDisplayComponent,
    title: 'Display Invoice',
    canActivate: [activeUserGuard]

  },
  {
    path: 'register',
    component: RegistrationComponent,
    title: "Register",

  },
  {
    path: 'login',
    component: LoginComponent,
    title: "login"
  },
  {
    path: 'forbidden',
    component: UnauthorizedComponent,
    title: 'forbidden'
  },
  {
    path: '**',
    component: NotFoundComponent,
    title: 'Not Found !'
  },
  {
    path: 'medicalRecord/display/:id',
    component:MedicalRecordComponent,
    title:'Display medicalRecord'

  }
];
