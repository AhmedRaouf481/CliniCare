import { Routes } from '@angular/router';
import { PatientProfileComponent } from './components/patient-profile/patient-profile.component';

export const routes: Routes = [
    {
        path: 'patient/:id',
        component: PatientProfileComponent,
        title: 'Patient Profile'
    }
];
