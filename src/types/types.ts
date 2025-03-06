export interface Rol {
    idRol?: number;
    nombre: string;
    descripcion?: string;
    usuarios?: Usuario[];
}

export interface Usuario {
    idUsuario?: number;
    nombreCompleto: string;
    email: string;
    telefono: string;
    password?: string;  // Agregamos el campo password
    fechaCreacion?: Date;
    ultimaConexion?: Date;
    roles?: Rol[];
  }
  

export interface Servicio {
    idServicio?: number;
    fechaServicio: Date;
    descripcion?: string;
    costo: number;
    tipoServicio: 'mantenimiento preventivo' | 'reparación correctiva' | 'revisión técnica';
    kilometraje: number;
    fechaCreacion?: Date;
    ultimaActualizacion?: Date;
    vehiculos?: Vehiculo;
    talleres?: Taller;
    estado: 'Pendiente' | 'Completado' | 'En Proceso';
}

export interface Vehiculo {
    idVehiculo?: number;
    marca: string;
    modelo: string;
    anio: number;
    numeroPlaca: string;
    color?: string;
    tipoCombustible?: string;
    odometro?: number;
    tipoVehiculo: 'automóvil' | 'camión' | 'motocicleta';
    fechaCreacion?: Date;
    ultimaActualizacion?: Date;
    servicios?: Servicio[];
}

export interface Taller {
    idTaller?: number;
    nombre: string;
    direccion: string;
    telefono: string;
    correoContacto?: string;
    horariosAtencion?: string;
    especialidades?: string[];
    fechaCreacion?: Date;
    ultimaActualizacion?: Date;
    servicios?: Servicio[];
}