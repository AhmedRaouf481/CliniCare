import { Doctor } from "./doctor";

export interface Slot {
  id: number;
  startTime: string;
  doctor?:Doctor
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

export interface SlotRequestInterface {
  doctor?:{
        id:number
    },
    clinicLocation:{
        id:number
    },
    startTime: string,
    weekDay: string
}