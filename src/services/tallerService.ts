import { Taller } from "../types/types";
import { fetchAPI } from "./api";

export const tallerService = {

    findAll: async (): Promise<Taller[]> => {
        return await fetchAPI('/talleres');
    },

    findById: async (id: number): Promise<Taller> => {
        return await fetchAPI(`/talleres/${id}`);
    },

    create: async (data: Partial<Taller>): Promise<Taller> => {
        const { nombre, direccion, telefono, correoContacto, horariosAtencion, especialidades, servicios } = data;
        return await fetchAPI('/talleres', {
            method: 'POST',
            body: JSON.stringify({ nombre, direccion, telefono, correoContacto, horariosAtencion, especialidades, servicios }),
        });
    },

    update: async (id: number, data: Partial<Taller>): Promise<Taller> => {
        const { nombre, direccion, telefono, correoContacto, horariosAtencion, especialidades, servicios } = data;
        return await fetchAPI(`/talleres/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ nombre, direccion, telefono, correoContacto, horariosAtencion, especialidades, servicios }),
        });
    },

    delete: async (id: number): Promise<Taller> => {
        return await fetchAPI(`/talleres/${id}`, {
            method: 'DELETE',
        });
    },

};