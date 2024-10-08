import {Specialization} from "./Specialization";
import {Clinic} from "./clinic";

export interface Doctor {
  id: number;
  email: string;
  name: string;
  username: string;
  updatedAt: Date | null;
  phone: string;
  roles: string[];
  enabled: boolean;
  credentialsNonExpired: boolean;
  accountNonExpired: boolean;
  accountNonLocked: boolean;
  authorities: string[];
  salary:string;
  summary:string;
  specialization: Specialization;
  slots: string[];
  appointments: string[];
  doctorClinics: Clinic[];





}
