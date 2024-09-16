import {Role} from "./Role";

export interface AuthResponse {
  token: string,
  name:string
  roles: Role[],
}
