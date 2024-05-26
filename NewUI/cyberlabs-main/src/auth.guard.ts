import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './app/auth.service';
import { inject } from '@angular/core';


export const authGuard: CanActivateFn = async (route, state) => {
  const router : Router = inject(Router);
  const auth : AuthService = inject(AuthService);
  const protectedRoutes : string[] = ['/student-dashboard','/teacher-dashboard'];
  const authenticated = await auth.isAuthenticated(); 

  return protectedRoutes.includes(state.url) && !authenticated
   ? router.navigate(['/login'])
   : true; 

  
};
