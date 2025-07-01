import { CanActivateFn } from '@angular/router';
import { AuthService } from './service/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {

  const auth = inject(AuthService);


  return auth.isUserLogin();

};
