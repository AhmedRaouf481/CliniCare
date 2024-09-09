import {Routes} from '@angular/router';
import {PatientProfileComponent} from './components/patient-profile/patient-profile.component';
// import {DoctorComponent} from "./components/doctor/doctor.component";
// import {DoctorEditComponent} from "./components/doctor-edit/doctor-edit.component";
import { ScheduleComponent } from './components/schedule/schedule.component';

export const routes: Routes = [
  {
    path: 'schedule',
    component: ScheduleComponent,
    title: 'Doctor Schedule'
  },
  {
    path: 'patient/:id',
    component: PatientProfileComponent,
    title: 'Patient Profile'
  },
  // {
  //   path: "doctor/:id",
  //   component: DoctorComponent,
  //   title: "Doctor"
  // },
  // {
  //   path: "doctor/edit/:id",
  //   component: DoctorEditComponent,
  //   title: "Doctor Edit"
  // }
];
