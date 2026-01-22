import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { useAuthStore } from '../../modules/auth/store/auth';

export const authGuard = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const authStore = useAuthStore();

  // 1. Intentar restaurar sesión si el usuario recargó la página (F5)
  // Esto revisa la cookie antes de decidir
  if (!authStore.isAuthenticated) {
    authStore.checkAuth();
  }

  // 2. Verificar si la ruta tiene la etiqueta "requiresAuth"
  if (to.meta.requiresAuth) {

    // CASO A: No está logueado
    if (!authStore.isAuthenticated) {
      // Redirigir al Login de React (Externo)
      const authUrl = import.meta.env.VITE_AUTH_URL || 'http://localhost:5174';
      // window.location.href hace una redirección completa fuera de Vue
      window.location.href = `${authUrl}/auth/login`;
      return; // Detenemos la navegación de Vue
    }

    // CASO B: Está logueado, pero verificamos su ROL
    const allowedRoles = to.meta.allowedRoles as string[] | undefined;

    // Si la ruta define roles y el rol del usuario NO está en la lista...
    if (allowedRoles && !allowedRoles.includes(authStore.user?.role || '')) {
      alert('⛔ Acceso Denegado: No tienes permisos para ver esta página.');
      next('/'); // Lo devolvemos al Home
      return;
    }
  }

  // 3. Si pasa todas las validaciones (o la ruta es pública), adelante
  next();
};
