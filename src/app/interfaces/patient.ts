export interface Patient {
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
  }