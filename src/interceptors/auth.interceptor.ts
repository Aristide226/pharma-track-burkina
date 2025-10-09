import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Crée un clone de la requête pour ajouter le header Authorization
  const fakeToken = 'super-secret-token';
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${fakeToken}`
    }
  });

  // Passe la requête modifiée à l'étape suivante de la chaîne d'intercepteurs
  return next(authReq);
};