import {ActivatedRoute, CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {AuthenticationService} from "../../services/auth/authentication.service";

export const activeUserGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);
  const authService = inject(AuthenticationService);


  if (route.routeConfig?.path?.startsWith('doctor') && !authService.isDoctor()) {
    router.navigate(['/forbidden']);
    return false;
  }

  if (route.routeConfig?.path?.startsWith('patient') && !authService.isPatient()) {
    router.navigate(['/forbidden']);
    return false;
  }

  return true;

};
