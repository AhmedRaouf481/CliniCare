export const URLs = {
  ApiBaseUrl: 'http://localhost:8080/api',

  login: 'auth/login',
  signUp: 'auth',
  slot: '/slot',
  doctorSlots: (doctorId: number) => `/slot/doctor/${doctorId}`,
  doctorClinics: (doctorId: number) => `/clinics/doctor/${doctorId}`,
  clinic: '/clinics',
  location: '/locations',
};
