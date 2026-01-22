import { defineStore } from 'pinia';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

interface User {
  email: string;
  role: string;
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null as string | null,
    user: null as User | null,
    isAuthenticated: false,
  }),

  actions: {
    checkAuth() {
      const token = Cookies.get('token');

      if (token) {
        try {
          const decoded: any = jwtDecode(token);
          this.token = token;
          this.isAuthenticated = true;
          this.user = {
            email: decoded.sub || decoded.email,
            role: decoded.role || 'cliente',
          };
        } catch (error) {
          console.error('Token inválido', error);
          // Si el token está corrupto, ahí sí limpiamos
          this.clearState();
        }
      } else {
        // CORRECCIÓN: Si no hay token, NO redirigimos. Solo limpiamos estado.
        this.clearState();
      }
    },

    // Nueva acción interna solo para limpiar datos sin redirigir
    clearState() {
      this.token = null;
      this.user = null;
      this.isAuthenticated = false;
      const isLocalhost = window.location.hostname.includes('localhost');
      Cookies.remove('token', {
        domain: isLocalhost ? undefined : '.hotelventura.com.ec'
      });
    },

    // Logout explícito (botón): Limpia Y Redirige
    logout() {
      this.clearState(); // 1. Limpia

      // 2. Redirige (Solo cuando el usuario quiere salir)
      const authUrl = import.meta.env.VITE_AUTH_URL || 'http://localhost:5174';
      window.location.href = `${authUrl}/auth/login`;
    }
  }
});
