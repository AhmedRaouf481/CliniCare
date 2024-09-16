export const URLs = {
  ApiBaseUrl: 'http://localhost:8080/api',

  login: '/auth/login',
  logout: '/auth/logout',
  signUp: '/auth/register',
  slot: '/slot',
  doctorSlots: (doctorId: number) => `/slot/doctor/${doctorId}`,
  doctorClinics: (doctorId: number) => `/clinics/doctor/${doctorId}`,
  mySlots:`/slot/me`,
  myClinics: `/clinics/me`,
  clinic: '/clinics',
  location: '/locations',
  appointment: '/appointment',
  myAppointment: '/appointment/me',
  apptBySlot: (slotId: number) => `/appointment/slot/${slotId}`,
  apptTypes: '/appointment/types',
  profile: '/users/profile',
  patient: '/patient'
};
