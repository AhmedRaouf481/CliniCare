export interface MedicalRecord {
    id: number;
    patientId: number;
    diagnosis: string;
    treatment: string;
    doctor: string;
    visitDate: Date;
    notes: string;
  }