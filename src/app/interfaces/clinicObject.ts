import {Clinic} from "./clinic";
import {Location} from "./location";

export interface ClinicObject {
  id: number;
  clinic: Clinic
  locations: Location;
}
