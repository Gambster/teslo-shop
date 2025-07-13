import { inject } from '@angular/core';
import { type CanMatchFn, type Route, type UrlSegment } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { firstValueFrom } from 'rxjs';

export const isAdminGuard: CanMatchFn = async (
  route: Route,
  segments: UrlSegment[]
): Promise<boolean> => {
  const authService = inject(AuthService);

  await firstValueFrom(authService.checkStatus());

  const isAdmin = authService.isAdmin();

  return isAdmin;
};
