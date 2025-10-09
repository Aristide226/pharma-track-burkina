import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

  if (currentUser && currentUser.role === 'admin') {
    return true; // L'utilisateur est un admin, accès autorisé
  }

  // Redirection vers la page de connexion si l'accès est refusé
  router.navigate(['/login']);
  return false;
};
