export interface Invoice {
    id?: number;
    patientId: number;
    appointmentId: number;
    amount: number;
    status: string;
    createdAt: string;
    updatedAt: string;
  }