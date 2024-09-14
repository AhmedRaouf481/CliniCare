import {Role} from "./Role";

export interface AuthResponse {
  token: string,
  roles: Role[],
  id: number
}
