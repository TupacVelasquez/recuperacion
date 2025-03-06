import React, { useRef, useState, useEffect } from 'react';
import { Toast } from 'primereact/toast';
import { Servicio } from '../types/types';
import { servicioService } from '../services/servicioService';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { InputNumber } from 'primereact/inputnumber';
import { vehiculoService } from '../services/vehiculoService';
import { tallerService } from '../services/tallerService';
import { Vehiculo } from '../types/types';
import { Taller } from '../types/types';

const RegistrosServicios: React.FC = () => {
    const [servicios, setServicios] = useState<Servicio[]>([]);
    const toast = useRef<Toast>(null);
    const [displayDialogServicio, setDisplayDialogServicio] = useState(false);
    const [editingServicio, setEditingServicio] = useState<Partial<Servicio>>({});
    const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
    const [talleres, setTalleres] = useState<Taller[]>([]);
    const [selectedVehiculo, setSelectedVehiculo] = useState<Vehiculo | null>(null);
    const [selectedTaller, setSelectedTaller] = useState<Taller | null>(null);

    const loadVehiculos = async () => {
        try {
            const data = await vehiculoService.findAll();
            console.log('Vehículos cargados:', data);
            setVehiculos(data);
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error al cargar los vehículos', life: 3000 });
        }
    };

    const loadTalleres = async () => {
        try {
            const data = await tallerService.findAll();
            console.log('Talleres cargados:', data);
            setTalleres(data);
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error al cargar los talleres', life: 3000 });
        }
    };

    const loadServicios = async () => {
        try {
            const data = await servicioService.findAll();
            setServicios(data);
            toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Servicios cargados', life: 3000 });
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error al cargar los servicios', life: 3000 });
        }
    };

    useEffect(() => {
        loadServicios();
        loadVehiculos();
        loadTalleres();
    }, []);

    const openNewServicio = () => {
        setEditingServicio({});
        setSelectedVehiculo(null); // Resetear la selección
        setSelectedTaller(null); // Resetear la selección
        setDisplayDialogServicio(true);
    };

    const hideDialog = () => {
        setDisplayDialogServicio(false);
    };

    const saveServicio = async () => {
        try {
            // Verificar que los IDs no sean nulos
            if (!selectedVehiculo?.idVehiculo || !selectedTaller?.idTaller) {
                throw new Error("Los IDs de Vehículo o Taller son obligatorios.");
            }
   
            // Crear el objeto con los IDs de Vehiculo y Taller
            const updatedServicio = {
                ...editingServicio,
                vehiculos: selectedVehiculo,
                talleres: selectedTaller
            };
   
            console.log("Datos a guardar en el backend:", updatedServicio); // Verificar datos antes de enviar
   
            if (editingServicio.idServicio) {
                // Actualización del servicio existente
                await servicioService.update(editingServicio.idServicio, updatedServicio);
                toast.current?.show({ severity: 'info', summary: 'Éxito', detail: 'Servicio actualizado correctamente', life: 3000 });
            } else {
                // Creación de un nuevo servicio
                await servicioService.create(updatedServicio);
                toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Servicio guardado correctamente', life: 3000 });
            }
   
            setDisplayDialogServicio(false);
            loadServicios();
        } catch (error) {
            console.error('Error al guardar el servicio:', error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error al guardar el servicio', life: 3000 });
        }
    };
   
    

    const footerDialogServicio = (
        <div>
            <Button label='Cancelar' icon='pi pi-times' className='p-button-text' onClick={hideDialog}></Button>
            <Button label='Guardar' icon='pi pi-save' className='p-button-text' onClick={saveServicio}></Button>
        </div>
    );

    const handleDelete = async (idServicio: number) => {
        try {
            await servicioService.delete(idServicio);
            toast.current?.show({ severity: 'info', summary: 'Éxito', detail: 'Servicio eliminado correctamente', life: 3000 });
            loadServicios();
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error al eliminar el servicio', life: 3000 });
        }
    };

    return (
        <div>
            <Toast ref={toast} />
            <h2>Gestión de Servicios</h2>
            <Button label='Nuevo Servicio' icon='pi pi-plus' onClick={openNewServicio}></Button>
            <br /><br />

            <DataTable value={servicios}>
                <Column field="idServicio" header="Id" sortable></Column>
                <Column field="vehiculos.marca" header="Vehículo" sortable body={(rowData: Servicio) => rowData.vehiculos?.marca}></Column>
                <Column field="talleres.nombre" header="Taller" sortable body={(rowData: Servicio) => rowData.talleres?.nombre}></Column>
                <Column field="fechaServicio" header="Fecha de Servicio" sortable body={(rowData: Servicio) => new Date(rowData.fechaServicio).toLocaleDateString()}></Column>
                <Column field="descripcion" header="Descripción" sortable></Column>
                <Column field="costo" header="Costo" sortable></Column>
                <Column field="tipoServicio" header="Tipo de Servicio" sortable></Column>
                <Column field="kilometraje" header="Kilometraje" sortable></Column>
                <Column header="Acciones" body={(rowData: Servicio) => (
                    <>
                        <Button icon='pi pi-pencil' className='p-button-rounded p-button-success p-mr-2' onClick={() => { 
                            setEditingServicio(rowData); 
                            setSelectedVehiculo(rowData.vehiculos ?? null); 
                            setSelectedTaller(rowData.talleres ?? null); 
                            setDisplayDialogServicio(true); 
                        }}></Button>
                        <Button icon='pi pi-trash' className='p-button-rounded p-button-danger' onClick={() => rowData.idServicio !== undefined && handleDelete(rowData.idServicio)}></Button>
                    </>
                )}></Column>
            </DataTable>

            <Dialog visible={displayDialogServicio} header={editingServicio.idServicio ? 'Editar Servicio' : 'Nuevo Servicio'} onHide={hideDialog} footer={footerDialogServicio}>

            <div className='p-field'>
                    <label htmlFor='vehiculos'>Vehículo: </label>
                    <Dropdown 
                        id='vehiculos' 
                        value={selectedVehiculo} 
                        options={vehiculos.map(v => ({ label: v.marca, value: v }))} 
                        onChange={(e) => setSelectedVehiculo(e.value)} 
                        placeholder="Seleccione un vehículo" 
                    />
                </div><br />

                <div className='p-field'>
                    <label htmlFor='talleres'>Taller: </label>
                    <Dropdown 
                        id='talleres' 
                        value={selectedTaller} 
                        options={talleres.map(t => ({ label: t.nombre, value: t }))} 
                        onChange={(e) => setSelectedTaller(e.value)} 
                        placeholder="Seleccione un taller" 
                    />
                </div><br />

                <div className='p-field'>
                    <label htmlFor='fechaServicio'>Fecha de Servicio: </label>
                    <Calendar id='fechaServicio' value={editingServicio.fechaServicio ?? undefined} onChange={(e) => setEditingServicio({ ...editingServicio, fechaServicio: e.value ?? undefined })} required />
                </div><br />
                <div className='p-field'>
                    <label htmlFor='descripcion'>Descripción: </label>
                    <InputText id='descripcion' value={editingServicio.descripcion} onChange={(e) => setEditingServicio({ ...editingServicio, descripcion: e.target.value })} />
                </div><br />
                <div className='p-field'>
                    <label htmlFor='costo'>Costo: </label>
                    <InputNumber id='costo' value={editingServicio.costo ?? undefined} onValueChange={(e) => setEditingServicio({ ...editingServicio, costo: e.value ?? undefined })} mode="currency" currency="USD" locale="en-US" required />
                </div><br />
                <div className='p-field'>
                    <label htmlFor='tipoServicio'>Tipo de Servicio: </label>
                    <Dropdown id='tipoServicio' value={editingServicio.tipoServicio} options={['mantenimiento preventivo', 'reparación correctiva', 'revisión técnica']} onChange={(e) => setEditingServicio({ ...editingServicio, tipoServicio: e.value })} placeholder="Seleccione un tipo de servicio" />
                </div><br />
                <div className='p-field'>
                    <label htmlFor='kilometraje'>Kilometraje: </label>
                    <InputNumber id='kilometraje' value={editingServicio.kilometraje ?? undefined} onValueChange={(e) => setEditingServicio({ ...editingServicio, kilometraje: e.value ?? undefined })} />
                </div>
            </Dialog>
        </div>
    );
}

export default RegistrosServicios;
