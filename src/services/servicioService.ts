import { Servicio } from "../types/types";
import { fetchAPI } from "./api";

export const servicioService = {

    findAll: async (): Promise<Servicio[]> => {
        return await fetchAPI('/servicios');
    },

    findById: async (id: number): Promise<Servicio> => {
        return await fetchAPI(`/servicios/${id}`);
    },

    create: async (data: Partial<Servicio>): Promise<Servicio> => {
        const { fechaServicio, descripcion, costo, tipoServicio, kilometraje, vehiculos, talleres } = data;
        return await fetchAPI('/servicios', {
            method: 'POST',
            body: JSON.stringify({ 
                fechaServicio, 
                descripcion, 
                costo, 
                tipoServicio, 
                kilometraje, 
                vehiculos, 
                talleres 
            }),
        });
    },
    

    update: async (id: number, data: Partial<Servicio>): Promise<Servicio> => {
        const { fechaServicio, descripcion, costo, tipoServicio, kilometraje, vehiculos, talleres } = data;
        return await fetchAPI(`/servicios/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ 
                fechaServicio, 
                descripcion, 
                costo, 
                tipoServicio, 
                kilometraje, 
                vehiculos, 
                talleres 
            }),
        });
    },
    

    delete: async (id: number): Promise<Servicio> => {
        return await fetchAPI(`/servicios/${id}`, {
            method: 'DELETE',
        });
    },

};