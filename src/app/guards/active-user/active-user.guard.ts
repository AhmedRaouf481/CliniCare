import {ActivatedRoute, CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {AuthenticationService} from "../../services/auth/authentication.service";

export const activeUserGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);
  const authService = inject(AuthenticationService);


  if (!authService.getUserId())
  {
    router.navigate(['/login']);
    return false;
  }

  if(route.routeConfig?.path?.startsWith('doctor') && !authService.isDoctor())
  {
    router.navigate(['/forbidden']);
    return false;
  }

  if(route.routeConfig?.path?.startsWith('patient') && !authService.isPatient())
  {
    router.navigate(['/forbidden']);
    return false;
  }

  if(route.paramMap.get('id') &&  authService.getUserId() != parseInt(route.paramMap.get('id') || '', 10))
  {
    router.navigate(['/forbidden']);
    return false;
  }

  return true;

};
