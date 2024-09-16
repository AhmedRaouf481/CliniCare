export const URLs = {
  ApiBaseUrl: 'http://localhost:8080/api',

  login: '/auth/login',
  logout: '/auth/logout',
  signUp: '/auth/register',
  slot: '/slot',
  doctorSlots: (doctorId: number) => `/slot/doctor/${doctorId}`,
  doctorClinics: (doctorId: number) => `/clinics/doctor/${doctorId}`,
  profile: '/users/profile',
  patient: '/patient'
};
