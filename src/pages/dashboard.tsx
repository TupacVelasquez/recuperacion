import React, { useState, useEffect, useRef } from 'react';
import { Toast } from 'primereact/toast';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { ProgressBar } from 'primereact/progressbar';
import { Carousel } from 'primereact/carousel';
import { Chart } from 'primereact/chart';
import { vehiculoService } from '../services/vehiculoService';
import { tallerService } from '../services/tallerService';
import { servicioService } from '../services/servicioService';
import { Vehiculo, Taller, Servicio } from '../types/types';
import { FaArrowUp } from 'react-icons/fa';

const Dashboard: React.FC = () => {
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

    const costosPorVehiculo = vehiculos.map(vehiculo => {
        const vehiculoServicios = servicios.filter(servicio => servicio.vehiculos?.idVehiculo === vehiculo.idVehiculo);
        return vehiculoServicios.reduce((total, servicio) => total + servicio.costo, 0);
    });

    const frecuenciaMantenimientosPorTaller = talleres.map(taller => {
        const tallerServicios = servicios.filter(servicio => servicio.talleres?.idTaller === taller.idTaller);
        return {
            taller: taller.nombre,
            frecuencia: tallerServicios.length
        };
    });

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

    const progresoTalleres = talleres.map(taller => {
        const tallerServicios = servicios.filter(servicio => servicio.talleres?.idTaller === taller.idTaller);
        const completados = tallerServicios.filter(servicio => servicio.estado === 'Completado').length;
        return {
            taller: taller.nombre,
            porcentaje: (completados / tallerServicios.length) * 100,
        };
    });

    const pieChartData = {
        labels: vehiculos.map(vehiculo => `${vehiculo.marca} ${vehiculo.modelo}`),
        datasets: [
            {
                data: costosPorVehiculo,
                backgroundColor: ['#42A5F5', '#66BB6A', '#FFEB3B', '#FF7043', '#8E24AA'],
                hoverBackgroundColor: ['#64B5F6', '#81C784', '#FFF59D', '#FF8A65', '#9C4DFF'],
            }
        ]
    };

    const pieOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                callbacks: {
                    label: (tooltipItem: any) => `${tooltipItem.label}: $${tooltipItem.raw}`,
                }
            }
        }
    };

    const responsiveOptions = [
        {
            breakpoint: '1024px',
            numVisible: 3,
            numScroll: 3
        },
        {
            breakpoint: '768px',
            numVisible: 2,
            numScroll: 2
        },
        {
            breakpoint: '560px',
            numVisible: 1,
            numScroll: 1
        }
    ];

    return (
        <div>
            <Toast ref={toast} />
            <h1>Dashboard de Vehículos y Talleres</h1>

            <h2>Talleres Disponibles</h2>
            <Carousel value={talleres} numVisible={3} numScroll={1} responsiveOptions={responsiveOptions} itemTemplate={(taller) => (
                <Card title={taller.nombre} subTitle={`Dirección: ${taller.direccion}`}>
                    <Button label="Ver Más" />
                </Card>
            )} />

            <h2>Costos Acumulados por Vehículo</h2>
            <div className="p-grid">
                <div className="p-col-12">
                    <Chart type="pie" data={pieChartData} options={pieOptions} />
                </div>
            </div>

            <h2>Reparaciones Recurrentes</h2>
            <div className="p-grid">
                {reparacionesData.map((item, index) => (
                    <div key={index} className="p-col-12 p-md-4">
                        <Card title={item.reparacion}>
                            <p>{`Frecuencia: ${item.frecuencia}`}</p>
                        </Card>
                    </div>
                ))}
            </div>

            <h2>Progreso de Trabajos Completados</h2>
            <div className="p-grid">
                {progresoTalleres.map((progreso, index) => (
                    <div key={index} className="p-col-12 p-md-4">
                        <Card title={progreso.taller}>
                            <ProgressBar value={progreso.porcentaje} showValue={true} />
                            {progreso.porcentaje < 100 ? (
                                <Button icon={<FaArrowUp />} label="Progreso" className="p-button-success" />
                            ) : (
                                <p>Trabajo Completado</p>
                            )}
                        </Card>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
