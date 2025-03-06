import React, { useState, useEffect, useRef } from 'react';
import { Chart } from 'primereact/chart';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { TabView, TabPanel } from 'primereact/tabview';
import { Toast } from 'primereact/toast';
import { vehiculoService } from '../services/vehiculoService';
import { tallerService } from '../services/tallerService';
import { servicioService } from '../services/servicioService';
import { Vehiculo, Taller, Servicio } from '../types/types';

const Reportes: React.FC = () => {
    const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
    const [talleres, setTalleres] = useState<Taller[]>([]);
    const [servicios, setServicios] = useState<Servicio[]>([]);
    const toast = useRef<Toast>(null);

    const loadVehiculos = async () => {
        try {
            const data = await vehiculoService.findAll();
            setVehiculos(data);
        } catch (error) {
            console.error('Error al cargar los vehículos:', error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error al cargar los vehículos' });
        }
    };

    const loadTalleres = async () => {
        try {
            const data = await tallerService.findAll();
            setTalleres(data);
        } catch (error) {
            console.error('Error al cargar los talleres:', error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error al cargar los talleres' });
        }
    };

    const loadServicios = async () => {
        try {
            const data = await servicioService.findAll();
            setServicios(data);
        } catch (error) {
            console.error('Error al cargar los servicios:', error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error al cargar los servicios' });
        }
    };

    useEffect(() => {
        loadServicios();
        loadVehiculos();
        loadTalleres();
    }, []);

    // Calculando los costos acumulados por vehículo
    const costosPorVehiculo = vehiculos.map(vehiculo => {
        const vehiculoServicios = servicios.filter(servicio => servicio.vehiculos?.idVehiculo === vehiculo.idVehiculo);
        return vehiculoServicios.reduce((total, servicio) => total + servicio.costo, 0);
    });

    // Calculando los costos acumulados por taller
    const costosPorTaller = talleres.map(taller => {
        const tallerServicios = servicios.filter(servicio => servicio.talleres?.idTaller === taller.idTaller);
        return tallerServicios.reduce((total, servicio) => total + servicio.costo, 0);
    });

    // Calculando la frecuencia de mantenimientos por vehículo
    const frecuenciaMantenimientos = vehiculos.map(vehiculo => {
        const vehiculoServicios = servicios.filter(servicio => servicio.vehiculos?.idVehiculo === vehiculo.idVehiculo);
        return {
            vehiculo: `${vehiculo.marca} ${vehiculo.modelo}`,
            frecuencia: vehiculoServicios.length
        };
    });

    // Calculando el tiempo promedio entre servicios por vehículo
    const tiempoPromedioEntreServicios = vehiculos.map(vehiculo => {
        const vehiculoServicios = servicios.filter(servicio => servicio.vehiculos?.idVehiculo === vehiculo.idVehiculo);
        if (vehiculoServicios.length < 2) return { vehiculo: `${vehiculo.marca} ${vehiculo.modelo}`, tiempoPromedio: 0 };
        
        const tiempos = vehiculoServicios.map((servicio, index) => {
            if (index === 0) return 0;  // No hay tiempo entre el primer servicio
            return (new Date(servicio.fechaServicio).getTime() - new Date(vehiculoServicios[index - 1].fechaServicio).getTime()) / (1000 * 3600 * 24); // En días
        });

        const tiempoPromedio = tiempos.reduce((sum, tiempo) => sum + tiempo, 0) / (tiempos.length - 1);
        return {
            vehiculo: `${vehiculo.marca} ${vehiculo.modelo}`,
            tiempoPromedio
        };
    });

    // Calculando reparaciones recurrentes
    const reparacionesRecurrentes = servicios.reduce((acc, servicio) => {
        if (servicio.descripcion) {
            if (!acc[servicio.descripcion]) acc[servicio.descripcion] = 0;
            acc[servicio.descripcion]++;
        }
        return acc;
    }, {} as Record<string, number>);

    const reparacionesData = Object.keys(reparacionesRecurrentes).map(reparacion => ({
        reparacion,
        frecuencia: reparacionesRecurrentes[reparacion]
    }));

    const chartData = {
        labels: vehiculos.map(vehiculo => `${vehiculo.marca} ${vehiculo.modelo}`),
        datasets: [
            {
                label: 'Costos Acumulados por Vehículo',
                data: costosPorVehiculo,
                backgroundColor: '#42A5F5',
            },
            {
                label: 'Costos Acumulados por Taller',
                data: costosPorTaller,
                backgroundColor: '#66BB6A',
            }
        ]
    };

    return (
        <div>
            <Toast ref={toast} />
            <h1>Bienvenido a la página de reportes</h1>
            <TabView>
                <TabPanel header="Costos Acumulados">
                    <Chart type="bar" data={chartData} />
                </TabPanel>
                <TabPanel header="Frecuencia de Mantenimientos">
                    <DataTable value={frecuenciaMantenimientos}>
                        <Column field="vehiculo" header="Vehículo" />
                        <Column field="frecuencia" header="Frecuencia" />
                    </DataTable>
                </TabPanel>
                <TabPanel header="Tiempo Promedio entre Servicios">
                    <DataTable value={tiempoPromedioEntreServicios}>
                        <Column field="vehiculo" header="Vehículo" />
                        <Column field="tiempoPromedio" header="Tiempo Promedio (días)" />
                    </DataTable>
                </TabPanel>
                <TabPanel header="Reparaciones Recurrentes">
                    <DataTable value={reparacionesData}>
                        <Column field="reparacion" header="Reparación" />
                        <Column field="frecuencia" header="Frecuencia" />
                    </DataTable>
                </TabPanel>
            </TabView>
        </div>
    );
};

export default Reportes;
