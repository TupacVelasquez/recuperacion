import { Usuario } from "../types/types";
import { fetchAPI } from "./api";

export const usuarioService = {

    findAll: async (): Promise<Usuario[]> => {
        return await fetchAPI('/usuarios');
    },

    findById: async (id: number): Promise<Usuario> => {
        return await fetchAPI(`/usuarios/${id}`);
    },

    create: async (data: Partial<Usuario>): Promise<Usuario> => {
        const { nombreCompleto, email, telefono } = data || {};
        return await fetchAPI('/usuarios', {
            method: 'POST',
            body: JSON.stringify({ nombreCompleto, email, telefono }),
        });
    },

    update: async (id: number, data: Partial<Usuario>): Promise<Usuario> => {
        const { nombreCompleto, email, telefono } = data;
        return await fetchAPI(`/usuarios/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ nombreCompleto, email, telefono }),
        });
    },

    delete: async (id: number): Promise<Usuario> => {
        return await fetchAPI(`/usuarios/${id}`, {
            method: 'DELETE',
        });
    },

    asignarRol: async (idUsuario: number, idRol: number): Promise<Usuario> => {
        return await fetchAPI(`/usuarios/${idUsuario}/roles/${idRol}`, {
            method: 'POST',
            body: JSON.stringify({}),
        });
    },

    removerRol: async (idUsuario: number, idRol: number): Promise<Usuario> => {
        return await fetchAPI(`/usuarios/${idUsuario}/roles/${idRol}`, {
            method: 'DELETE',
        });
    }

};