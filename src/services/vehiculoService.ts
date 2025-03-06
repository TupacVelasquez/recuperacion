import { Vehiculo } from "../types/types";
import { fetchAPI } from "./api";

export const vehiculoService = {

    findAll: async (): Promise<Vehiculo[]> => {
        return await fetchAPI('/vehiculos');
    },

    findById: async (id: number): Promise<Vehiculo> => {
        return await fetchAPI(`/vehiculos/${id}`);
    },

    create: async (data: Partial<Vehiculo>): Promise<Vehiculo> => {
        const { marca, modelo, anio, numeroPlaca, color, tipoCombustible, odometro, tipoVehiculo } = data;
        return await fetchAPI('/vehiculos', {
            method: 'POST',
            body: JSON.stringify({ marca, modelo, anio, numeroPlaca, color, tipoCombustible, odometro, tipoVehiculo }),
        });
    },

    update: async (id: number, data: Partial<Vehiculo>): Promise<Vehiculo> => {
        const { marca, modelo, anio, numeroPlaca, color, tipoCombustible, odometro, tipoVehiculo } = data;
        return await fetchAPI(`/vehiculos/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ marca, modelo, anio, numeroPlaca, color, tipoCombustible, odometro, tipoVehiculo }),
        });
    },

    delete: async (id: number): Promise<Vehiculo> => {
        return await fetchAPI(`/vehiculos/${id}`, {
            method: 'DELETE',
        });
    },

};