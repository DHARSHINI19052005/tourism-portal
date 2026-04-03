import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/** Protects standard app pages from unauthenticated users */
export const authGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.currentUser) {
        return true;
    }
    return router.parseUrl('/signin');
};

/** Strictly controls user dashboard access */
export const userGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const user = authService.currentUser;

    if (user && user.role === 'user') {
        return true;
    }

    if (user && user.role === 'admin') {
        return router.parseUrl('/admin');
    }

    return router.parseUrl('/signin');
};

/** Strictly controls admin dashboard access */
export const adminGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const user = authService.currentUser;

    if (user && user.role === 'admin') {
        return true;
    }

    if (user && user.role === 'user') {
        return router.parseUrl('/analytics');
    }

    return router.parseUrl('/signin');
};
