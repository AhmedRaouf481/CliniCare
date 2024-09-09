export interface Slot {
  id: number;
  startTime: string;
  clinicLocation: {
    id: number;
    city: string;
    addressLine: string;
    clinic: {
      id: number;
      name: string;
    };
  };
  weekDay: string;
}
