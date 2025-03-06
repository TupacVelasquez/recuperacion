import { Rol } from "../types/types";
import { fetchAPI } from "./api";

export const rolService = {


    findAll: async ():Promise<Rol[]> =>{
        return await fetchAPI('/roles');
    },

    findById: async (id: number):Promise<Rol> =>{
        return await fetchAPI(`/roles/${id}`);
    },

    create: async (data: Partial<Rol>):Promise<Rol> =>{
        const {nombre, descripcion} = data;
        return await fetchAPI('/roles', {
            method: 'POST',
            body: JSON.stringify({nombre, descripcion}),
        });
    },

    update: async (id: number, data: Partial<Rol>):Promise<Rol> =>{
        const {nombre, descripcion} = data;
        return await fetchAPI(`/roles/${id}`, {
            method: 'PUT',
            body: JSON.stringify({nombre, descripcion}),
        });
    },

    delete: async (id: number):Promise<Rol> =>{
        return await fetchAPI(`/roles/${id}`, {
            method: 'DELETE',
        });
    },

};