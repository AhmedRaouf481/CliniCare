export const URLs = {
  ApiBaseUrl: 'http://localhost:8080/api',

  login: '/auth/login',
  signUp: '/auth/register',
  slot: '/slot',
  doctorSlots: (doctorId: number) => `/slot/doctor/${doctorId}`,
  doctorClinics: (doctorId: number) => `/clinics/doctor/${doctorId}`,
  clinic: '/clinics',
  location: '/locations',
  appointment: '/appointment',
  myAppointment: '/appointment/me',
  apptBySlot: (slotId: number) => `/appointment/slot/${slotId}`,
  apptTypes: '/appointment/types',
};
