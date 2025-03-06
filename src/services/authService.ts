import { Usuario } from "../types/types";
import { fetchAPI } from "./api";

export const authService = {
    // Función de registro
    register: async (data: Usuario): Promise<Usuario> => {
        const { nombreCompleto, email, telefono, password } = data;
        return await fetchAPI('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ nombreCompleto, email, telefono, password }),
        });
    },

    // Función de inicio de sesión
    login: async (email: string, password: string): Promise<{ token: string }> => {
        return await fetchAPI('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
    },

    // Función para obtener el perfil del usuario autenticado
    getProfile: async (): Promise<Usuario> => {
        return await fetchAPI('/auth/profile');
    },

    // Función para cerrar sesión (limpiar token)
    logout: () => {
        localStorage.removeItem('token');
    },

    // Función para validar si el usuario está autenticado (basado en el token)
    isAuthenticated: (): boolean => {
        const token = localStorage.getItem('token');
        return !!token;
    }
};
